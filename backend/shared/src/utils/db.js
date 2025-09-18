import { pool } from "../database/connection.js";

export async function query(sql, params = []) {
  try {
    const start = Date.now();
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;

    // console.log("✅ SQL:", sql, "⏱", duration + "ms");
    return { success: true, data: result };
  } catch (err) {
    console.error("❌ DB ERROR:", err);
    return { success: false, data: null, err };
  }
}
