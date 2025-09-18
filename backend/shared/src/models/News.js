import { NEWS_COLUMNS as COL } from "../constants/database.js";
export class News {
  constructor({
    [COL.ID]: id,
    [COL.TITLE]: title,
    [COL.CONTENT]: content,
    [COL.CREATED_AT]: created_at,
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = created_at;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
    };
  }

  toDatabaseFormat() {
    return {
      [COL.ID]: this.id,
      [COL.TITLE]: this.title,
      [COL.CONTENT]: this.content,
      [COL.CREATED_AT]: this.createdAt,
    };
  }

  getPreview(length = 100) {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}
