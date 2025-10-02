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

  async create({ title, content, sourceUrl = "Random", images = [] }) {
    const imagesJSON = JSON.stringify(images);

    const result = await this.query(
      `INSERT INTO ${NEWS_TABLE} 
      (${COL.TITLE}, 
      ${COL.CONTENT}, 
      ${COL.SOURCE_URL},
      ${COL.IMAGES},
      ${COL.CREATED_AT}) 
      VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [title, content, sourceUrl, imagesJSON]
    );

    if (result.success) {
      const { data } = result;
      return new News(data.rows[0]);
    } else {
      return {};
    }
  }

  async deleteDuplicates(duplicationType = COL.CONTENT) {
    const result = await this.query(`
      DELETE FROM ${NEWS_TABLE}
      WHERE id IN (
        SELECT id
        FROM (
          SELECT id,
                 ROW_NUMBER() OVER (PARTITION BY ${duplicationType} ORDER BY id ASC) AS row_num
          FROM ${NEWS_TABLE}
        ) t
        WHERE t.row_num > 1
      )
    `);

    if (result.success) {
      return true;
    } else {
      return false;
    }
  }

  async deleteAllResetIds() {
    const result = await this.query(
      `TRUNCATE TABLE ${NEWS_TABLE} RESTART IDENTITY`
    );

    if (result.success) {
      return true;
    } else {
      return false;
    }
  }

  async delete(id) {
    const result = await this.query("DELETE FROM news WHERE id = $1", [id]);

    if (result.success) {
      return true;
    } else {
      return false;
    }
  }
}

export const newsService = new NewsService();
