import {
  newsSourcesConfig,
  getSourceConfig,
  getAvailableSources,
} from "./external.js";

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Всі джерела новин
  newsSources: newsSourcesConfig,

  // Налаштування CORS
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },

  // Налаштування кешування
  cache: {
    ttl: process.env.CACHE_TTL || 300000, // 5 хвилин
    maxSize: process.env.CACHE_MAX_SIZE || 100,
  },

  // Налаштування логування
  logging: {
    level: process.env.LOG_LEVEL || "info",
    enableConsole: process.env.LOG_CONSOLE !== "false",
  },
};

export { getSourceConfig, getAvailableSources };
export { newsSourcesConfig };
