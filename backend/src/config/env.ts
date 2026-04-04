import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.BASE_PORT || 5000,
  HOST: process.env.BASE_HOST || '0.0.0.0',
  // CLIENT
  CLIENT_ORIGINS: process.env.CLIENT_ORIGINS,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,

  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  // SERVER
  BASE_URL: process.env.BASE_URL || "http://localhost:5000",
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI: process.env.MONGODB_URI!,

  // SECRETS
  JWT_SECRET: process.env.JWT_SECRET!,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  CSRF_SECRET: process.env.CSRF_SECRET!,

  SEED_ENABLED: process.env.SEED_ENABLED || 'false',
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || "invalid-key",
};
