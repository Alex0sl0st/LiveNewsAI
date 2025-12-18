import { query } from "../utils/db.js";
import { News } from "../models/News.js";
import { NEWS_COLUMNS as COL, NEWS_TABLE } from "../constants/database.js";
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

  async delete(ids) {
    const idsArray = Array.isArray(ids) ? ids : [ids];

    if (idsArray.length === 0) {
      return { success: false, deletedCount: 0 };
    }

    const result = await this.query(
      "DELETE FROM news WHERE id = ANY($1) RETURNING id",
      [idsArray]
    );

    if (result.success) {
      return {
        success: true,
        deletedCount: result.data.rowCount,
      };
    } else {
      console.log("❌ Failed to delete news");
      return {
        success: false,
        deletedCount: 0,
      };
    }
  }

  async getFilteredNews(filters = {}, categoriesCache = {}) {
    const {
      date = {},
      mainCategories: rawMainCategories = [],
      sources = [],
    } = filters;

    // Check for special filters
    const requestNoCategory = rawMainCategories.includes("noCategory");
    const requestUnmapped = rawMainCategories.includes("unmappedCategory");

    const mainCategories = rawMainCategories.filter(
      (s) => s !== "noCategory" && s !== "unmappedCategory"
    );

    const availableCategories =
      await categoryService.getAvailableNewsCategories(categoriesCache);
    const allValidCategoryIds = await categoryService.getAvailableCategoriesIds(
      availableCategories
    );

    const mainCategoriesId = await categoryService.convertSlugsToIds(
      mainCategories,
      availableCategories
    );

    const whereParts = [];
    const values = [];
    let paramIndex = 1;

    // === DATE FILTER ===
    if (date.dateFrom) {
      whereParts.push(`${COL.PUBLISHED_AT} >= $${paramIndex}`);
      values.push(date.dateFrom + " 00:00:00");
      paramIndex++;
    }

    if (date.dateTo) {
      whereParts.push(`${COL.PUBLISHED_AT} <= $${paramIndex}`);
      values.push(date.dateTo + " 23:59:59");
      paramIndex++;
    }

    // === SOURCES FILTER ===
    if (sources.length > 0) {
      whereParts.push(`${COL.SOURCE_NAME} = ANY($${paramIndex})`);
      values.push(sources);
      paramIndex++;
    }

    // === CATEGORY FILTERS (OR logic inside group) ===
    const categoryConditions = [];

    // === MAIN CATEGORIES (by IDs) ===
    if (mainCategoriesId.length > 0) {
      categoryConditions.push(`${COL.CATEGORY_ID} = ANY($${paramIndex})`);
      values.push(mainCategoriesId);
      paramIndex++;
    }

    // --- CATEGORY FILTER: noCategory (NULL) ---
    if (requestNoCategory) {
      categoryConditions.push(`${COL.CATEGORY_ID} IS NULL`);
    }

    // --- CATEGORY FILTER: unmappedCategory ---
    if (requestUnmapped) {
      categoryConditions.push(
        `(${COL.CATEGORY_ID} IS NOT NULL AND ${
          COL.CATEGORY_ID
        } NOT IN (${allValidCategoryIds.join(",")}))`
      );
    }

    if (categoryConditions.length > 0) {
      whereParts.push(`(${categoryConditions.join(" OR ")})`);
    }

    // === BUILD WHERE CLAUSE ===
    const whereSQL =
      whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

    const querySQL = `
      SELECT * FROM ${NEWS_TABLE}
      ${whereSQL}
      ORDER BY ${COL.PUBLISHED_AT} DESC
    `;

    const result = await this.query(querySQL, values);

    if (!result.success) {
      console.log("❌ Failed to fetch filtered news");
      return [];
    }

    return result.data.rows.map((row) => new News(row));
  }

  async updateNewsCategory(
    newsId,
    mainSlug,
    relevantSlugs = [],
    categoriesCache = {}
  ) {
    const availableCategories =
      await categoryService.getAvailableNewsCategories(categoriesCache);
    const mainCategoryId = await categoryService.convertSlugToId(
      mainSlug,
      availableCategories
    );

    if (mainCategoryId === undefined) {
      console.log(`Category not found for slug: ${mainSlug}`);
      return null;
    }

    const relevantIds = await categoryService.convertSlugsToIds(
      relevantSlugs,
      availableCategories
    );

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
