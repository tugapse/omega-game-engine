import { describe, expect, it, vi } from 'vitest';
import { ResourceCache } from '../src/core/resources/resource-cache';

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('ResourceCache', () => {
  it('loads a key once and shares it between handles', async () => {
    const load = vi.fn(async (k: string) => ({ k }));
    const cache = new ResourceCache({ load });
    const a = await cache.acquire('x');
    const b = await cache.acquire('x');
    expect(a.value).toBe(b.value);
    expect(load).toHaveBeenCalledTimes(1);
    expect(cache.stats()).toEqual({ entries: 1, loading: 0, unused: 0, references: 2 });
  });

  it('shares one load between requests made at the same time', async () => {
    const d = deferred<string>();
    const load = vi.fn(() => d.promise);
    const cache = new ResourceCache({ load });
    const p1 = cache.acquire('x');
    const p2 = cache.acquire('x');
    expect(cache.stats().loading).toBe(1);
    d.resolve('value');
    const [a, b] = await Promise.all([p1, p2]);
    expect(load).toHaveBeenCalledTimes(1);
    expect(a.value).toBe('value');
    expect(b.value).toBe('value');
  });

  it('does not cache a failed load', async () => {
    const load = vi
      .fn<(k: string) => Promise<string>>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce('ok');
    const cache = new ResourceCache({ load });
    await expect(cache.acquire('x')).rejects.toThrow('offline');
    expect(cache.has('x')).toBe(false);
    expect((await cache.acquire('x')).value).toBe('ok');
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('rejects every waiter of a failed load', async () => {
    const d = deferred<string>();
    const cache = new ResourceCache({ load: () => d.promise });
    const p1 = cache.acquire('x');
    const p2 = cache.acquire('x');
    d.reject(new Error('boom'));
    await expect(p1).rejects.toThrow('boom');
    await expect(p2).rejects.toThrow('boom');
    expect(cache.stats().references).toBe(0);
  });

  it('keeps an unused entry for reuse until trim disposes it', async () => {
    const dispose = vi.fn();
    const load = vi.fn(async () => 'v');
    const cache = new ResourceCache({ load, dispose });
    const h = await cache.acquire('x');
    h.release();
    expect(dispose).not.toHaveBeenCalled();
    expect(cache.stats().unused).toBe(1);

    const again = await cache.acquire('x');
    expect(load).toHaveBeenCalledTimes(1);
    expect(cache.trim()).toBe(0); // held again

    again.release();
    expect(cache.trim()).toBe(1);
    expect(dispose).toHaveBeenCalledTimes(1);
    expect(dispose).toHaveBeenCalledWith('v');
    expect(cache.has('x')).toBe(false);
  });

  it('counts a handle released twice only once', async () => {
    const cache = new ResourceCache({ load: async () => 'v' });
    const a = await cache.acquire('x');
    const b = await cache.acquire('x');
    a.release();
    a.release();
    expect(cache.stats().references).toBe(1);
    b.release();
    expect(cache.stats().references).toBe(0);
  });

  it('clear disposes everything once, held or not', async () => {
    const dispose = vi.fn();
    const cache = new ResourceCache({ load: async (k: string) => k, dispose });
    const held = await cache.acquire('a');
    (await cache.acquire('b')).release();
    cache.clear();
    expect(dispose).toHaveBeenCalledTimes(2);
    expect(cache.stats()).toEqual({ entries: 0, loading: 0, unused: 0, references: 0 });
    held.release(); // a stale handle does nothing
    expect(cache.stats().references).toBe(0);
  });

  it('disposes a value whose load finishes after a clear', async () => {
    const d = deferred<string>();
    const dispose = vi.fn();
    const cache = new ResourceCache({ load: () => d.promise, dispose });
    const p = cache.acquire('x');
    cache.clear();
    d.resolve('late');
    await p;
    expect(dispose).toHaveBeenCalledWith('late');
    expect(cache.has('x')).toBe(false);
  });

  it('peek returns only loaded values and takes no reference', async () => {
    const d = deferred<string>();
    const cache = new ResourceCache({ load: () => d.promise });
    const p = cache.acquire('x');
    expect(cache.peek('x')).toBeUndefined();
    d.resolve('v');
    (await p).release();
    expect(cache.peek('x')).toBe('v');
    expect(cache.stats().references).toBe(0);
  });
});
