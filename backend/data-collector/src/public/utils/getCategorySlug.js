import { availableCategories } from "../js/constants/newsCategories.js";

export function getCategorySlug(id) {
  let categorySlug = availableCategories[id];
  categorySlug = categorySlug ? categorySlug : null;

  return categorySlug;
}
