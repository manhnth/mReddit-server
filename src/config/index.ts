import { config } from 'dotenv';
process.env.NODE_ENV = 'production';
config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});
export const CREDENTIALS = true;
// export const {
//   NODE_ENV,
//   PORT,
//   SECRET_KEY,
//   REFRESH_KEY,
//   LOG_FORMAT,
//   LOG_DIR,
//   ORIGIN,
//   HITS_PER_PAGE,
// } = process.env;

// config token expires time
export const EXPIRES_IN = 60 * 15 * 1000; // 15m
export const REFRESH_EXPIRES_IN = 60 * 60 * 24 * 7 * 1000; // 7 days
// export const NODE_ENV = process.env.NODE_ENV;
// export const PORT = process.env.PORT;
// export const SECRET_KEY = process.env.SECRET_KEY;
// export const REFRESH_KEY = process.env.REFRESH_KEY;
// export const LOG_FORMAT = process.env.LOG_FORMAT;
// export const LOG_DIR = process.env.LOG_DIR;
// export const ORIGIN = process.env.ORIGIN;
export const HITS_PER_PAGE = 10;
