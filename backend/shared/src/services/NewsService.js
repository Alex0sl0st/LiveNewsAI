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

  async create({
    title,
    content,
    sourceName = "Unknown",
    sourceUrl = "Random",
    publishedAt = null,
    images = [],
  }) {
    const imagesJSON = JSON.stringify(images);

    const result = await this.query(
      `INSERT INTO ${NEWS_TABLE} 
      (${COL.TITLE}, 
      ${COL.CONTENT}, 
      ${COL.SOURCE_URL},
      ${COL.PUBLISHED_AT},
      ${COL.SOURCE_NAME},
      ${COL.IMAGES},
      ${COL.CREATED_AT}) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [title, content, sourceUrl, publishedAt, sourceName, imagesJSON]
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

  async updateNewsCategory(newsId, mainSlug, relevantSlugs = []) {
    const mainRes = await this.query(
      `SELECT id FROM news_categories WHERE slug = $1`,
      [mainSlug]
    );
    if (!mainRes.success || mainRes.data.rowCount === 0) {
      console.log(`Category not found for slug: ${mainSlug}`);
      return null;
    }
    const mainCategoryId = mainRes.data.rows[0].id;

    // // 2. Знайти id релевантних категорій
    // let relevantIds = [];
    // if (relevantSlugs.length > 0) {
    //   const relevantRes = await this.query(
    //     `SELECT id FROM news_categories WHERE slug = ANY($1)`,
    //     [relevantSlugs]
    //   );
    //   relevantIds = relevantRes.data.rows.map((r) => r.id);
    // }

    // 3. Оновити новину
    const updateRes = await this.query(
      `UPDATE ${NEWS_TABLE}
       SET ${COL.CATEGORY_ID} = $1,
           ${COL.RELEVANT_CATEGORIES} = $2
       WHERE id = $3
       RETURNING *`,
      [mainCategoryId, [], newsId]
    );

    if (!updateRes.success || !(updateRes.data.rowCount > 0)) {
      console.log(`Failed to update category for news id=${newsId}`);
    }
  }
}

export const newsService = new NewsService();
