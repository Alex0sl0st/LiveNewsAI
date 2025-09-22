import { NEWS_COLUMNS as COL } from "../constants/database.js";
export class News {
  constructor({
    [COL.ID]: id,
    [COL.TITLE]: title,
    [COL.CONTENT]: content,
    [COL.SUMMARY]: summary,
    [COL.SOURCE_NAME]: source_name,
    [COL.SOURCE_URL]: source_url,
    [COL.PUBLISHED_AT]: published_at,
    [COL.CREATED_AT]: created_at,
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.summary = summary;
    this.sourceName = source_name;
    this.sourceUrl = source_url;
    this.publishedAt = published_at;
    this.createdAt = created_at;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      summary: this.summary,
      sourceName: this.sourceName,
      sourceUrl: this.sourceUrl,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
    };
  }

  toDatabaseFormat() {
    return {
      [COL.ID]: this.id,
      [COL.TITLE]: this.title,
      [COL.CONTENT]: this.content,
      [COL.SUMMARY]: this.summary,
      [COL.SOURCE_NAME]: this.sourceName,
      [COL.SOURCE_URL]: this.sourceUrl,
      [COL.PUBLISHED_AT]: this.publishedAt,
      [COL.CREATED_AT]: this.createdAt,
    };
  }

  getPreview(length = 100) {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}
