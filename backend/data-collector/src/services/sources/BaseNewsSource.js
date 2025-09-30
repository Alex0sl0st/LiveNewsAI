class BaseNewsSource {
  constructor(config, sourceName) {
    if (!config) {
      throw new Error("Config is required for news source");
    }

    this.config = config;
    this.sourceName = sourceName || config.name;
  }

  async fetchNews() {
    throw new Error("fetchNews() must be implemented in subclass");
  }

  toStandardFormat({
    title,
    content,
    sourceUrl,
    publishedAt,
    summary,
    images,
  }) {
    return {
      title: title?.trim() || "Untitled",
      content: content?.trim(),
      sourceUrl,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      summary: summary?.trim() || null,
      images: images || [],
    };
  }
}

export default BaseNewsSource;
