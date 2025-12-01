import { query } from "../utils/db.js";
import { NEWS_CATEGORIES } from "../constants/database.js";
import { isEmptyObject } from "../utils/validation.js";

export class CategoryService {
  constructor(queryFn = query) {
    this.query = queryFn;
  }
  async getAvailableNewsCategories(categoriesCache = {}) {
    if (!isEmptyObject(categoriesCache)) {
      return categoriesCache;
    }

    const res = await this.query(`SELECT id, slug FROM ${NEWS_CATEGORIES}`);
    if (!res.success) return {};
    return Object.fromEntries(res.data.rows.map((r) => [r.id, r.slug]));
  }

  async convertSlugToId(slug, categoriesCache = {}) {
    const availableCategories = await this.getAvailableNewsCategories(
      categoriesCache
    );

    return Object.keys(availableCategories).find(
      (id) => availableCategories[id] === slug
    );
  }

  async convertSlugsToIds(slugs, categoriesCache = {}) {
    const ids = (
      await Promise.all(
        slugs.map(async (slug) => {
          const id = await this.convertSlugToId(slug, categoriesCache);
          return id;
        })
      )
    ).filter((id) => id || id === 0);

    return ids;
  }

  async getAvailableCategoriesIds(categoriesCache = {}) {
    const availableCategories = await this.getAvailableNewsCategories(
      categoriesCache
    );

    return Object.keys(availableCategories);
  }
}
export const categoryService = new CategoryService();
