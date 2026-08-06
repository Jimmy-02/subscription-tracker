import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const PORT = getEnvVar("PORT");
export const DB_URI = getEnvVar("DB_URI");
export const NODE_ENV = process.env.NODE_ENV || "development";