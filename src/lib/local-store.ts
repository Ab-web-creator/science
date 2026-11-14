/** A tiny store kept in localStorage, readable with useSyncExternalStore.
 *  Snapshots are cached so React sees the same object until the data changes. */
export function createLocalStore<T>(key: string, empty: T) {
  const listeners = new Set<() => void>();
  let cached: { raw: string | null; value: T } | null = null;
  let memory: string | null = null; // used when storage is unavailable

  function rawValue() {
    try {
      return localStorage.getItem(key);
    } catch {
      return memory;
    }
  }
  function get(): T {
    const raw = rawValue();
    if (cached && cached.raw === raw) return cached.value;
    let value = empty;
    try {
      value = raw ? (JSON.parse(raw) as T) : empty;
    } catch {
      value = empty;
    }
    cached = { raw, value };
    return value;
  }
  function set(next: T) {
    const raw = JSON.stringify(next);
    try {
      localStorage.setItem(key, raw);
    } catch {
      memory = raw;
    }
    listeners.forEach((l) => l());
  }
  return {
    get,
    set,
    update: (fn: (current: T) => T) => set(fn(get())),
    getServer: () => empty,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
