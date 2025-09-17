export class News {
  constructor({ id, title, content, created_at }) {
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

  getPreview(length = 100) {
    return this.content.length > length
      ? this.content.substring(0, length) + "..."
      : this.content;
  }
}
