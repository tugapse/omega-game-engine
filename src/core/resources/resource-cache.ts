/**
 * A reference to a cached resource. Call `release()` when you stop using it;
 * calling it more than once has no further effect.
 */
export interface ResourceHandle<V> {
  readonly key: string;
  readonly value: V;
  release(): void;
}

export interface ResourceCacheOptions<V> {
  /** Loads the resource for a key. Called once per key while it is cached. */
  load: (key: string) => Promise<V>;
  /** Frees a resource (e.g. deletes a GL texture) when it leaves the cache. */
  dispose?: (value: V) => void;
}

export interface ResourceCacheStats {
  /** Loaded resources held by the cache. */
  entries: number;
  /** Resources still loading. */
  loading: number;
  /** Loaded resources nobody holds a handle to (freed by `trim()`). */
  unused: number;
  /** Handles currently held, over all entries. */
  references: number;
}

interface Entry<V> {
  refs: number;
  promise: Promise<V>;
  value?: V;
  loaded: boolean;
}

/**
 * A keyed cache of loaded resources with reference counting.
 *
 * - Requests for a key that is already loading share the same load.
 * - A failed load is not cached: the next request tries again.
 * - Each `acquire` returns a handle; the entry is in use while any handle is
 *   held. An unused entry stays cached for reuse until `trim()` or `clear()`
 *   disposes it.
 */
export class ResourceCache<V> {
  private readonly entries = new Map<string, Entry<V>>();

  constructor(private readonly options: ResourceCacheOptions<V>) {}

  /** Loads (or reuses) the resource for `key` and holds a reference to it. */
  async acquire(key: string): Promise<ResourceHandle<V>> {
    let entry = this.entries.get(key);
    if (!entry) {
      entry = this.startLoad(key);
    }
    entry.refs++;
    try {
      const value = await entry.promise;
      return this.createHandle(key, entry, value);
    } catch (error) {
      entry.refs--;
      throw error;
    }
  }

  /** The loaded value for `key`, if any, without taking a reference. */
  peek(key: string): V | undefined {
    const entry = this.entries.get(key);
    return entry?.loaded ? entry.value : undefined;
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }

  /**
   * Forgets the entry for `key` without disposing it (its owner already
   * did). With `value`, only if the entry holds that value.
   */
  remove(key: string, value?: V): boolean {
    const entry = this.entries.get(key);
    if (!entry || (value !== undefined && entry.value !== value)) return false;
    this.entries.delete(key);
    return true;
  }

  /** Disposes every loaded entry that nobody holds. Returns how many. */
  trim(): number {
    let freed = 0;
    for (const [key, entry] of this.entries) {
      if (entry.loaded && entry.refs === 0) {
        this.entries.delete(key);
        this.disposeValue(entry.value as V);
        freed++;
      }
    }
    return freed;
  }

  /**
   * Disposes every loaded entry, held or not, and forgets everything.
   * Handles still out there keep their value but no longer count.
   */
  clear(): void {
    const entries = [...this.entries.values()];
    this.entries.clear();
    for (const entry of entries) {
      if (entry.loaded) this.disposeValue(entry.value as V);
    }
  }

  stats(): ResourceCacheStats {
    let loading = 0;
    let unused = 0;
    let references = 0;
    for (const entry of this.entries.values()) {
      if (!entry.loaded) loading++;
      else if (entry.refs === 0) unused++;
      references += entry.refs;
    }
    return { entries: this.entries.size - loading, loading, unused, references };
  }

  private startLoad(key: string): Entry<V> {
    const entry: Entry<V> = { refs: 0, loaded: false, promise: undefined as unknown as Promise<V> };
    entry.promise = this.options.load(key).then(
      (value) => {
        if (this.entries.get(key) === entry) {
          entry.value = value;
          entry.loaded = true;
        } else {
          // Cleared while loading: nobody will find it in the cache again.
          this.disposeValue(value);
        }
        return value;
      },
      (error) => {
        if (this.entries.get(key) === entry) this.entries.delete(key);
        throw error;
      },
    );
    this.entries.set(key, entry);
    return entry;
  }

  private createHandle(key: string, entry: Entry<V>, value: V): ResourceHandle<V> {
    let released = false;
    return {
      key,
      value,
      release: () => {
        if (released) return;
        released = true;
        // Only count it against the entry it came from (not one reloaded after a clear).
        if (this.entries.get(key) === entry && entry.refs > 0) entry.refs--;
      },
    };
  }

  private disposeValue(value: V): void {
    try {
      this.options.dispose?.(value);
    } catch (error) {
      console.error('[ResourceCache] dispose failed', error);
    }
  }
}
