// Простая обёртка над localStorage с тем же API, что был в прототипе.
// В продакшене заменить на запросы к бэкенду.

const PREFIX = "snipr:";

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  delete(key) {
    try {
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch {
      return false;
    }
  },

  list(prefix = "") {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey?.startsWith(PREFIX + prefix)) {
        keys.push(fullKey.slice(PREFIX.length));
      }
    }
    return keys;
  },
};
