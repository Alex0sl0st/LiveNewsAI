import { query } from "../utils/db.js";
import { News } from "../models/News.js";
import { NEWS_COLUMNS as COL, NEWS_TABLE } from "../constants/database.js";
import { getRandomUuid } from "../utils/getRandomId.js";

class NewsService {
  constructor(queryFn = query) {
    this.query = queryFn;
  }

  async getAll() {
    const result = await this.query(
      `SELECT * FROM ${NEWS_TABLE} ORDER BY ${COL.CREATED_AT} DESC`
    );

    if (result.success) {
      const { data } = result;
      return data.rows.map((row) => new News(row));
    } else {
      return [];
    }
  }

  async create({ title, content, sourceUrl = "Random" }) {
    const result = await this.query(
      `INSERT INTO ${NEWS_TABLE} 
      (${COL.TITLE}, 
      ${COL.CONTENT}, 
      ${COL.SOURCE_URL},
      ${COL.CREATED_AT}) 
      VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [title, content, sourceUrl]
    );

    if (result.success) {
      const { data } = result;
      return new News(data.rows[0]);
    } else {
      return {};
    }
  }

  async delete(id) {
    await this.query("DELETE FROM news WHERE id = $1", [id]);
    return true;
  }
}

export const newsService = new NewsService();
