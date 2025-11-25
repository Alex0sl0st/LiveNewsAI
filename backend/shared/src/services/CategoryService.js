import { query } from "../utils/db.js";
import { NEWS_CATEGORIES } from "../constants/database.js";

export class CategoryService {
  constructor(queryFn = query) {
    this.query = queryFn;
  }
  async getAvailableNewsCategories() {
    const res = await this.query(`SELECT id, slug FROM ${NEWS_CATEGORIES}`);
    if (!res.success) return {};
    return Object.fromEntries(res.data.rows.map((r) => [r.id, r.slug]));
  }
}
export const categoryService = new CategoryService();
