export function extractPublishDate($) {
  // Method 1: JSON-LD with id="link-ld-json"

  const jsonLdScript = $("#link-ld-json").html();
  if (jsonLdScript) {
    try {
      const data = JSON.parse(jsonLdScript);
      if (Array.isArray(data) && data[0] && data[0].datePublished) {
        return new Date(data[0].datePublished);
      } else if (data.datePublished) {
        return new Date(data.datePublished);
      }
    } catch (_) {}
  }

  // Method 2: Meta tags (fallback)
  const metaDate = $('meta[property="article:published_time"]').attr("content");
  if (metaDate) {
    return new Date(metaDate);
  }

  return null;
}
