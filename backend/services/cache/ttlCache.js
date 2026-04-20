class TTLCache {
  constructor(defaultTtlMs = 60000) {
    this.defaultTtlMs = defaultTtlMs;
    this.store = new Map();
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    const expiresAt = Date.now() + ttlMs;
    this.store.set(key, { value, expiresAt });
  }

  get(key) {
    const cached = this.store.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return cached.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

module.exports = TTLCache;
