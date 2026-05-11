// Генерация случайного 6-символьного кода для короткой ссылки
export const generateShortCode = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

// Реферальный код: первые 4 буквы логина + 4 случайных символа
export const generateRefCode = (username) =>
  username.slice(0, 4).toLowerCase() + Math.random().toString(36).slice(2, 6);

// Простой хеш для демо. В продакшене — bcrypt на бэкенде.
export const hashPassword = (pw) => {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    hash = (hash << 5) - hash + pw.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
};

// Форматирование даты
export const formatDate = (ts) => {
  const d = new Date(ts);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatMoney = (n) => `${n.toFixed(2)} ₽`;

// Симуляция перехода — генерим случайный клик с метаданными
export const simulateClick = () => {
  const countries = ["RU", "US", "DE", "FR", "JP", "BR", "KZ", "UA", "BY", "PL"];
  const devices = ["mobile", "desktop", "tablet"];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  return {
    ts: Date.now() - Math.floor(Math.random() * 86400000 * 14),
    country: countries[Math.floor(Math.random() * countries.length)],
    device: devices[Math.floor(Math.random() * devices.length)],
    browser: browsers[Math.floor(Math.random() * browsers.length)],
    revenue: Math.random() * 0.05 + 0.001,
  };
};

// Базовый URL для отображения коротких ссылок.
// Берёт текущий хост, чтобы работало и локально, и на проде.
// На сервере (без window) — fallback на snipr.io.
export const BASE_URL =
  typeof window !== "undefined" ? window.location.host : "snipr.io";
