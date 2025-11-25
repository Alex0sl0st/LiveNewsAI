export const NEWS_COLUMNS = {
  ID: "id",
  TITLE: "title",
  CONTENT: "content",
  DESCRIPTION: "description",
  SUMMARY: "summary",
  SOURCE_NAME: "source_name",
  SOURCE_URL: "source_url",
  PUBLISHED_AT: "published_at",
  CREATED_AT: "created_at",
  IMAGES: "images",
  CATEGORY_ID: "category_id",
  RELEVANT_CATEGORIES: "relevant_categories",
};

export const NEWS_TABLE = "news";
export const NEWS_CATEGORIES = "news_categories";

export const DEFAULT_IMAGE_OBJECT = {
  url: "",
  type: "image",
  caption: "",
};

export function createDefaultImage({ url, caption = "", type = "image" }) {
  return { url, caption, type };
}
