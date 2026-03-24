import mysql from "mysql2/promise";

const { DATABASE_URL } = process.env;

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL env var is not set");
    }
    pool = mysql.createPool(DATABASE_URL);
  }
  return pool;
}

