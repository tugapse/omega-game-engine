/**
 * @module
 * Framework-agnostic Audio Cache and Streaming Manager.
 * Handles RAM caching of short audio assets with toggleable LRU eviction and background streaming.
 */

export interface CacheConfig {
  /**
   * Enables or disables the Least Recently Used (LRU) eviction policy.
   * When enabled, the cache will automatically remove the least recently accessed assets
   * to make space when the cache size limit is reached.
   * @defaultValue `true`
   */
  useLRU: boolean;
  /**
   * The maximum memory size in bytes for the cache.
   * This is a soft limit for uncompressed PCM audio data stored in `AudioBuffer` objects.
   * @defaultValue `52428800` (50 MB)
   */
  maxCacheBytes: number;
}

/**
 * Manages loading, caching, and streaming of audio assets. It provides an in-memory cache
 * for frequently used short sounds (e.g., sound effects) and supports streaming for long
 * audio tracks (e.g., music) to minimize memory footprint.
 */
export class AudioCache {
  private cache = new Map<string, AudioBuffer>();
  private activeStreams = new Map<string, HTMLAudioElement>();
  
  // LRU Tracking
  private lruQueue: string[] = [];
  private currentCacheBytes = 0;

  constructor(
    private audioContext: AudioContext,
    private config: CacheConfig = { useLRU: true, maxCacheBytes: 50 * 1024 * 1024 } // 50MB Default
  ) {}

  /**
   * Fetches an audio asset using a relative URL, decodes it off-thread, and caches it in RAM.
   * If the asset is already in the cache, it returns the cached version.
   *
   * @remarks
   * This method is ideal for short, frequently played sounds like UI feedback or game sound effects.
   * The decoded `AudioBuffer` is stored in memory for fast, low-latency playback.
   * If LRU is enabled, loading a new asset may cause the oldest asset to be evicted.
   *
   * @param id - A unique identifier for the audio asset.
   * @param relativeUrl - The URL path to the audio file (e.g., 'assets/sounds/laser.wav').
   * @returns A promise that resolves with the decoded `AudioBuffer`.
   * @throws If the fetch request fails or the audio data cannot be decoded.
   */
  public async load(id: string, relativeUrl: string): Promise<AudioBuffer> {
    if (this.cache.has(id)) {
      this.updateAccess(id);
      return this.cache.get(id)!;
    }

    try {
      const response = await fetch(relativeUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch asset from "${relativeUrl}": ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const estimatedBytes = this.estimateBufferSize(audioBuffer);
      if (this.config.useLRU) {
        this.evictToFit(estimatedBytes);
      }

      this.cache.set(id, audioBuffer);
      this.currentCacheBytes += estimatedBytes;
      this.lruQueue.push(id);

      return audioBuffer;
    } catch (error) {
      throw new Error(`Asset load failed for "${id}": ${(error as Error).message}`);
    }
  }

  /**
   * Retrieves a pre-loaded audio asset from the cache.
   * @param id - The unique identifier of the asset to retrieve.
   * @returns The cached `AudioBuffer`.
   * @throws If the asset with the specified `id` is not found in the cache.
   * @see {@link AudioCache.load} to load an asset before getting it.
   */
  public get(id: string): AudioBuffer {
    const buffer = this.cache.get(id);
    if (!buffer) {
      throw new Error(`Asset "${id}" is not loaded in the memory cache.`);
    }
    this.updateAccess(id);
    return buffer;
  }

  /**
   * Manually registers a pre-existing `AudioBuffer` in the cache.
   * This is useful for procedurally generated audio data.
   * @param id - A unique identifier for the buffer.
   * @param buffer - The `AudioBuffer` to add to the cache.
   */
  public register(id: string, buffer: AudioBuffer): void {
    const bytes = this.estimateBufferSize(buffer);
    if (this.config.useLRU) {
      this.evictToFit(bytes);
    }
    this.cache.set(id, buffer);
    this.currentCacheBytes += bytes;
    this.lruQueue.push(id);
  }

  /**
   * Checks if an asset is currently in the cache.
   * @param id - The unique identifier of the asset.
   * @returns `true` if the asset is in the cache, `false` otherwise.
   */
  public has(id: string): boolean {
    return this.cache.has(id);
  }

  /**
   * Removes a specific asset from the cache to free up memory.
   * @param id - The unique identifier of the asset to remove.
   */
  public unload(id: string): void {
    const buffer = this.cache.get(id);
    if (buffer) {
      this.currentCacheBytes -= this.estimateBufferSize(buffer);
      this.cache.delete(id);
      this.lruQueue = this.lruQueue.filter(item => item !== id);
    }
  }

  /**
   * Clears the entire audio cache, removing all loaded assets and resetting memory counters.
   */
  public clear(): void {
    this.cache.clear();
    this.lruQueue = [];
    this.currentCacheBytes = 0;
  }

  /**
   * Enables or disables the Least Recently Used (LRU) eviction policy at runtime.
   * If enabled, the cache will be trimmed to fit the `maxCacheBytes` limit.
   * @param enabled - `true` to enable LRU, `false` to disable.
   */
  public setLRU(enabled: boolean): void {
    this.config.useLRU = enabled;
    if (enabled) {
      this.evictToFit(0);
    }
  }

  /**
   * Creates an HTML5 Audio element for streaming long-form audio like music or ambient tracks.
   * This method avoids loading the entire file into memory. The audio element is connected
   * to the specified Web Audio API `AudioNode`.
   *
   * @remarks
   * The returned `<audio>` element can be controlled with standard methods like `.play()` and `.pause()`.
   *
   * @param id - A unique identifier for the audio stream.
   * @param relativeUrl - The URL path to the audio file.
   * @param outputNode - The Web Audio API node (e.g., a GainNode or the context destination) to which the stream will be connected.
   * @returns The configured `HTMLAudioElement` ready for playback.
   */
  public createStream(id: string, relativeUrl: string, outputNode: AudioNode): HTMLAudioElement {
    if (this.activeStreams.has(id)) {
      return this.activeStreams.get(id)!;
    }

    const audio = new Audio();
    audio.src = relativeUrl;
    audio.crossOrigin = 'anonymous';
    audio.loop = true;
    audio.autoplay = false;

    const source = this.audioContext.createMediaElementSource(audio);
    source.connect(outputNode);

    this.activeStreams.set(id, audio);
    return audio;
  }

  /**
   * Stops and cleans up a streaming audio element.
   * @param id - The unique identifier of the stream to destroy.
   */
  public destroyStream(id: string): void {
    const audio = this.activeStreams.get(id);
    if (audio) {
      audio.pause();
      audio.src = '';
      audio.load(); // Forces allocation cleanup of stream packets
      this.activeStreams.delete(id);
    }
  }

  // --- LRU Internals (Private) ---

  private updateAccess(id: string): void {
    if (this.config.useLRU) {
      this.lruQueue = this.lruQueue.filter(item => item !== id);
      this.lruQueue.push(id);
    }
  }

  private evictToFit(incomingBytes: number): void {
    while (
      this.currentCacheBytes + incomingBytes > this.config.maxCacheBytes && 
      this.lruQueue.length > 0
    ) {
      const oldestId = this.lruQueue.shift();
      if (oldestId) {
        const buffer = this.cache.get(oldestId);
        if (buffer) {
          this.currentCacheBytes -= this.estimateBufferSize(buffer);
          this.cache.delete(oldestId);
        }
      }
    }
  }

  private estimateBufferSize(buffer: AudioBuffer): number {
    /**
     * Uncompressed PCM byte size estimate.
     * Each sample is a 32-bit float (4 bytes).
     * Size = number of channels * number of samples (length) * 4 bytes/sample.
     */
    return buffer.numberOfChannels * buffer.length * 4;
  }
}