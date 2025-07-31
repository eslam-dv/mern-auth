const getenv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
};

const NODE_ENV = getenv("NODE_ENV");
const MONGO_URI = getenv("MONGO_URI");
const PORT = getenv("PORT", "3001");
const JWT_SECRET = getenv("JWT_SECRET");
const JWT_REFRESH_SECRET = getenv("JWT_REFRESH_SECRET");
const APP_ORIGIN = getenv("APP_ORIGIN");
const SMTP_HOST = getenv("SMTP_HOST");
const SMTP_USER = getenv("SMTP_USER");
const SMTP_PASS = getenv("SMTP_PASS");

export {
  NODE_ENV,
  MONGO_URI,
  PORT,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  APP_ORIGIN,
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASS,
};
