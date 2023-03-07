import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  REFRESH_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  HITS_PER_PAGE,
} = process.env;

// config token expires time
export const EXPIRES_IN = 60 * 15 * 1000; // 15m
export const REFRESH_EXPIRES_IN = 60 * 60 * 24 * 7 * 1000; // 7 days
