export function extractPublishDate($) {
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const jsonText = $(scripts[i]).html();
      if (!jsonText) continue;

      const data = JSON.parse(jsonText);

      // Find object with datePublished (BBC stores it here)
      const node = Array.isArray(data)
        ? data.find((d) => d.datePublished)
        : data;
      if (node && node.datePublished) {
        return new Date(node.datePublished);
      }
    } catch (_) {
      // Skip invalid JSON
    }
  }

  return null;
}
