import { quat } from 'gl-matrix';
import { EntityBehaviour } from '../behaviours/entity-behaviour';
import { Resources } from '../core/resources/resources';
import { Transform } from '../core/transform';
import { parseModelPartUri } from '../core/model/model-data';
import { JsonSerializedData } from '../interfaces/json-serialized-data';
import { AnimationChannel, AnimationClip, sampleChannel } from './animation-clip';

/** The first key's value of a translation channel (skipping a cubic in-tangent). */
function firstKey(channel: AnimationChannel): Float32Array {
  const o = channel.interpolation === 'CUBICSPLINE' ? 3 : 0;
  return channel.values.subarray(o, o + 3);
}

/** A bone name with ':' written as '_', so FBX and COLLADA names match. */
function boneAlias(name: string): string {
  return name.replace(/:/g, '_');
}

/** A minimal typed event: `subscribe` returns a function that unsubscribes. */
export class AnimationEvent<T> {
  private listeners: ((value: T) => void)[] = [];
  subscribe(listener: (value: T) => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter((l) => l !== listener); };
  }
  emit(value: T): void {
    for (const l of [...this.listeners]) l(value);
  }
}

/** A clip being played: its time and its weight in a crossfade. */
interface PlayState {
  clip: AnimationClip;
  time: number;
  weight: number;
  /** Key index per channel, so sampling forward is O(1). */
  hints: number[];
  /** Bone per channel (null when no bone has the channel's name). */
  targets: (Transform | null)[];
  loop: boolean;
  finished: boolean;
  /** Index of the root bone's translation channel (-1 if none), for `inPlace`. */
  rootChannel: number;
}

/**
 * Plays animation clips on the bones under its entity (the model's root).
 *
 * Clips come from model files: `clipUris` lists `<model>#anim/<n>`, and an
 * animation exported on its own (Mixamo "Without Skin") works on any
 * character with the same bone names. Channels find their bone by entity
 * name among the entity's descendants.
 *
 * ```ts
 * const anim = this.parent.getBehaviour(Animator)!;
 * anim.play('Walk');
 * anim.crossFade('Run', 0.25);
 * ```
 */
export class Animator extends EntityBehaviour {
  static override instanciate(): Animator {
    return new Animator();
  }
  protected override _className = 'Animator';

  /** The clips this animator can play, as model part URIs (`<model>#anim/<n>`). */
  public clipUris: string[] = [];
  /** The clip played on start: a clip name, or empty for the first clip. */
  public defaultClip = '';
  public playOnStart = true;
  /** Playback speed: 1 is normal, 0 freezes, negative plays backwards. */
  public speed = 1;
  public loop = true;
  /** Also animate in the editor, without pressing Play. */
  public playInEditor = false;
  /**
   * Keep the character in place: the root bone (e.g. Mixamo's Hips) keeps
   * its horizontal position from the first frame, so walks and dances don't
   * move the model away. Height (crouch, jump) still animates.
   */
  public inPlace = false;

  /** Fired when a clip without loop reaches its end. */
  public readonly onFinished = new AnimationEvent<AnimationClip>();
  /** Fired each time a looping clip wraps round. */
  public readonly onLoop = new AnimationEvent<AnimationClip>();

  private clips: AnimationClip[] = [];
  /** Clips added with addClip: kept when (re)initialising loads the clipUris. */
  private codeClips: AnimationClip[] = [];
  private current: PlayState | null = null;
  private previous: PlayState | null = null;
  private fadeDuration = 0;
  private fadeTime = 0;
  private bonesByName = new Map<string, Transform>();
  private loading: Promise<void> | null = null;
  private readonly value = new Float32Array(4);
  private readonly blendA = new Float32Array(4);
  private readonly q1 = quat.create();
  private readonly q2 = quat.create();

  constructor() {
    super();
    this._serializationIgnoreKeys.push('onFinished', 'onLoop', 'clips', 'codeClips', 'current', 'previous', 'fadeDuration', 'fadeTime', 'bonesByName', 'loading', 'value', 'blendA', 'q1', 'q2');
  }

  /** The loaded clips. */
  get clipList(): readonly AnimationClip[] {
    return this.clips;
  }

  /** The clip playing (the one fading in during a crossfade). */
  get currentClip(): AnimationClip | null {
    return this.current?.clip ?? null;
  }

  /** Time in seconds in the current clip. Setting it jumps there. */
  get time(): number {
    return this.current?.time ?? 0;
  }
  set time(seconds: number) {
    if (!this.current) return;
    this.current.time = seconds;
    this.current.finished = false;
    this.apply();
  }

  /** Resolves when the clips are loaded. */
  whenLoaded(): Promise<void> {
    return this.loading ?? Promise.resolve();
  }

  override initialize(): boolean {
    const ok = super.initialize();
    // The scene only updates entities flagged for it while editing.
    if (this.playInEditor && this.parent) this.parent.updateInEditor = true;
    this.loading = this.loadClips().catch((error) => console.error('Animator: cannot load clips', error));
    return ok;
  }

  private async loadClips(): Promise<void> {
    const clips: AnimationClip[] = [];
    for (const uri of this.clipUris) {
      const part = parseModelPartUri(uri);
      if (part?.kind !== 'anim') { console.warn(`Animator: "${uri}" is not <model>#anim/<n>`); continue; }
      const model = await Resources.for().getModel(part.modelUri);
      const clip = model.clips[part.index];
      if (clip) clips.push(clip);
    }
    this.clips = [...clips, ...this.codeClips];
    if (this.playOnStart && clips.length && !this.current) this.play(this.defaultClip || clips[0].name);
  }

  /** Adds a clip at run time (e.g. one built in code). */
  addClip(clip: AnimationClip): void {
    this.codeClips.push(clip);
    this.clips.push(clip);
  }

  /** Finds a loaded clip by name, or by index. */
  getClip(nameOrIndex: string | number): AnimationClip | undefined {
    return typeof nameOrIndex === 'number' ? this.clips[nameOrIndex] : this.clips.find((c) => c.name === nameOrIndex);
  }

  /** Starts a clip from the beginning, cutting whatever was playing. */
  play(nameOrIndex: string | number, options: { loop?: boolean } = {}): boolean {
    const clip = this.getClip(nameOrIndex);
    if (!clip) { console.warn(`Animator: no clip "${nameOrIndex}"`); return false; }
    this.current = this.stateFor(clip, options.loop ?? this.loop);
    this.previous = null;
    this.fadeDuration = 0;
    this.apply();
    return true;
  }

  /** Blends from the current clip to another over `duration` seconds. */
  crossFade(nameOrIndex: string | number, duration = 0.25, options: { loop?: boolean } = {}): boolean {
    const clip = this.getClip(nameOrIndex);
    if (!clip) { console.warn(`Animator: no clip "${nameOrIndex}"`); return false; }
    if (!this.current || duration <= 0) return this.play(nameOrIndex, options);
    if (this.current.clip === clip && !this.previous) return true;
    this.previous = this.current;
    this.current = this.stateFor(clip, options.loop ?? this.loop);
    this.fadeDuration = duration;
    this.fadeTime = 0;
    return true;
  }

  /** Stops playback; the bones keep the current pose. */
  stop(): void {
    this.current = null;
    this.previous = null;
  }

  /** Whether `name` (or any clip, without a name) is playing. */
  isPlaying(name?: string): boolean {
    if (!this.current || this.current.finished) return false;
    return !name || this.current.clip.name === name;
  }

  override update(elapsed: number): void {
    // While editing, only animate when asked to (playInEditor).
    if (!this.parent?.scene?.isRunning && !this.playInEditor) return;
    this.advance(elapsed);
  }

  /** Moves time forward by `elapsed` seconds and poses the bones. */
  advance(elapsed: number): void {
    if (!this.current) return;
    for (const state of [this.current, this.previous]) {
      if (state) this.step(state, elapsed * this.speed);
    }
    if (this.previous) {
      this.fadeTime += Math.abs(elapsed * this.speed);
      const w = Math.min(1, this.fadeTime / this.fadeDuration);
      this.current.weight = w;
      if (w >= 1) this.previous = null;
    }
    this.apply();
  }

  private step(state: PlayState, dt: number): void {
    if (state.finished) return;
    const d = state.clip.duration;
    state.time += dt;
    if (d <= 0) return;
    if (state.loop) {
      if (state.time >= d || state.time < 0) {
        state.time = ((state.time % d) + d) % d;
        if (state === this.current) this.onLoop.emit(state.clip);
      }
    } else if (state.time >= d || state.time <= 0) {
      state.time = Math.min(Math.max(state.time, 0), d);
      state.finished = true;
      if (state === this.current) this.onFinished.emit(state.clip);
    }
  }

  private stateFor(clip: AnimationClip, loop: boolean): PlayState {
    if (!this.bonesByName.size) this.collectBones();
    let targets = clip.channels.map((c) => this.bonesByName.get(c.target) ?? this.bonesByName.get(boneAlias(c.target)) ?? null);
    if (targets.some((t) => !t)) {
      this.collectBones(); // bones added since (or renamed): look again
      targets = clip.channels.map((c) => this.bonesByName.get(c.target) ?? this.bonesByName.get(boneAlias(c.target)) ?? null);
    }
    // The root bone: the translated bone closest to this entity.
    const depth = (t: Transform | null) => { let d = 0; for (let p = t; p && p !== this.parent?.transform; p = p.parent) d++; return t ? d : Infinity; };
    let rootChannel = -1;
    clip.channels.forEach((c, i) => {
      if (c.property === 'translation' && targets[i] && (rootChannel < 0 || depth(targets[i]) < depth(targets[rootChannel]))) rootChannel = i;
    });
    return { clip, time: this.speed < 0 ? clip.duration : 0, weight: 1, hints: clip.channels.map(() => 0), targets, loop, finished: false, rootChannel };
  }

  private collectBones(): void {
    this.bonesByName.clear();
    const visit = (t: Transform) => {
      const entity = t.parentEntity;
      if (entity && !this.bonesByName.has(entity.name)) this.bonesByName.set(entity.name, t);
      // FBX writes "mixamorig:Hips", COLLADA "mixamorig_Hips": accept either.
      const alias = entity ? boneAlias(entity.name) : '';
      if (entity && !this.bonesByName.has(alias)) this.bonesByName.set(alias, t);
      for (const child of t.children) visit(child);
    };
    if (this.parent) visit(this.parent.transform);
  }

  /** Samples the playing clips and writes the bones' local transforms. */
  private apply(): void {
    const current = this.current;
    if (!current) return;
    const previous = this.previous;
    // During a crossfade, bones animated by the old clip blend towards the new one.
    const blend = new Map<Transform, Map<string, Float32Array>>();
    if (previous && current.weight < 1) {
      previous.clip.channels.forEach((channel, i) => {
        const bone = previous.targets[i];
        if (!bone) return;
        previous.hints[i] = sampleChannel(channel, previous.time, this.blendA, previous.hints[i]);
        if (this.inPlace && i === previous.rootChannel) {
          const first = firstKey(channel);
          this.blendA[0] = first[0];
          this.blendA[2] = first[2];
        }
        let perBone = blend.get(bone);
        if (!perBone) blend.set(bone, (perBone = new Map()));
        perBone.set(channel.property, Float32Array.from(this.blendA));
      });
    }
    current.clip.channels.forEach((channel, i) => {
      const bone = current.targets[i];
      if (!bone) return;
      current.hints[i] = sampleChannel(channel, current.time, this.value, current.hints[i]);
      if (this.inPlace && i === current.rootChannel) {
        const first = firstKey(channel);
        this.value[0] = first[0];
        this.value[2] = first[2];
      }
      const from = blend.get(bone)?.get(channel.property);
      if (from) this.mix(channel, from, this.value, current.weight);
      this.write(bone, channel, this.value);
    });
  }

  private mix(channel: AnimationChannel, from: Float32Array, to: Float32Array, w: number): void {
    if (channel.property === 'rotation') {
      quat.set(this.q1, from[0], from[1], from[2], from[3]);
      quat.set(this.q2, to[0], to[1], to[2], to[3]);
      quat.slerp(this.q1, this.q1, this.q2, w);
      to.set(this.q1);
    } else {
      for (let k = 0; k < 3; k++) to[k] = from[k] + (to[k] - from[k]) * w;
    }
  }

  private write(bone: Transform, channel: AnimationChannel, v: Float32Array): void {
    if (channel.property === 'translation') bone.setLocalPosition(v[0], v[1], v[2]);
    else if (channel.property === 'scale') bone.setLocalScale(v[0], v[1], v[2]);
    else bone.setLocalRotationQuat(quat.set(this.q1, v[0], v[1], v[2], v[3]));
  }

  override toJsonObject(): JsonSerializedData {
    return {
      ...super.toJsonObject(),
      clipUris: [...this.clipUris],
      defaultClip: this.defaultClip,
      playOnStart: this.playOnStart,
      speed: this.speed,
      loop: this.loop,
      playInEditor: this.playInEditor,
      inPlace: this.inPlace,
    };
  }

  override fromJson(jsonObject: JsonSerializedData): void {
    super.fromJson(jsonObject);
    this.clipUris = [...(jsonObject['clipUris'] ?? [])];
    this.defaultClip = jsonObject['defaultClip'] ?? '';
    this.playOnStart = jsonObject['playOnStart'] ?? true;
    this.speed = jsonObject['speed'] ?? 1;
    this.loop = jsonObject['loop'] ?? true;
    this.playInEditor = jsonObject['playInEditor'] ?? false;
    this.inPlace = jsonObject['inPlace'] ?? false;
  }
}

