export function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.search = "";
    return u.toString();
  } catch (err) {
    console.error("[normalizeUrl] Invalid URL:", url);
    return url;
  }
}
