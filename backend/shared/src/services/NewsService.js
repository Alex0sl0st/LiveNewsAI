import { query } from "../utils/db.js";
import { News } from "../models/News.js";

class NewsService {
  constructor(queryFn = query) {
    this.query = queryFn;
  }

  async getAll() {
    const result = await this.query(
      "SELECT * FROM news ORDER BY created_at DESC"
    );

    if (result.success) {
      const { data } = result;
      return data.rows.map((row) => new News(row));
    } else {
      return [];
    }
  }

  async create({ title, content }) {
    const result = await this.query(
      "INSERT INTO news (title, content, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [title, content]
    );
    return new News(result.rows[0]);
  }

  async delete(id) {
    await this.query("DELETE FROM news WHERE id = $1", [id]);
    return true;
  }
}

export const newsService = new NewsService();
