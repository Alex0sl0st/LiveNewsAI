import { query } from "../utils/db.js";
import { News } from "../models/News.js";
import { NEWS_COLUMNS as COL, NEWS_TABLE } from "../constants/database.js";
import { isEmptyObject } from "../utils/validation.js";
import { categoryService } from "./CategoryService.js";

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

  async getByDateRange(fromDate, toDate) {
    if (!fromDate || !toDate) {
      console.log("❌ Missing fromDate or toDate");
      return [];
    }

    const result = await this.query(
      `
      SELECT * FROM ${NEWS_TABLE}
      WHERE ${COL.PUBLISHED_AT} BETWEEN $1 AND $2
      ORDER BY ${COL.PUBLISHED_AT} DESC
      `,
      [fromDate + " 00:00:00", toDate + " 23:59:59"]
    );

    if (result.success) {
      return result.data.rows.map((row) => new News(row));
    } else {
      return [];
    }
  }

  async updateNewsCategory(
    newsId,
    mainSlug,
    relevantSlugs = [],
    availableCategories = {}
  ) {
    if (isEmptyObject(availableCategories)) {
      availableCategories = await categoryService.getAvailableNewsCategories();

      if (isEmptyObject(availableCategories)) {
        console.log(`Categories list is empty`);
        return null;
      }
    }

    const mainCategoryId = Object.keys(availableCategories).find(
      (id) => availableCategories[id] === mainSlug
    );

    if (mainCategoryId === undefined) {
      console.log(`Category not found for slug: ${mainSlug}`);
      return null;
    }

    const relevantIds = relevantSlugs
      .map((slug) => {
        const id = Object.keys(availableCategories).find(
          (key) => availableCategories[key] === slug
        );
        return id !== undefined ? id : null;
      })
      .filter((id) => id !== null);

    const updateRes = await this.query(
      `UPDATE ${NEWS_TABLE}
         SET ${COL.CATEGORY_ID} = $1,
             ${COL.RELEVANT_CATEGORIES} = $2
         WHERE id = $3
         RETURNING *`,
      [mainCategoryId, relevantIds, newsId]
    );

    if (!updateRes.success || updateRes.data.rowCount === 0) {
      console.log(`Failed to update category for news id=${newsId}`);
      return null;
    }

    return updateRes.data.rows[0];
  }
}

export const newsService = new NewsService();
