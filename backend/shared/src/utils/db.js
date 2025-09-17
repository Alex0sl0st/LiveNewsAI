import { pool } from "../database/connection.js";

export async function query(sql, params = []) {
  try {
    const start = Date.now();
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;

    console.log("✅ SQL:", sql, "⏱", duration + "ms");
    return result;
  } catch (err) {
    console.error("❌ DB ERROR:", err.message);
    throw err;
  }
}
