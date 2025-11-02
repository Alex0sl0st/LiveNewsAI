import { BLOCKED_PATTERNS } from "../../constants/bbcConstants.js";

export function isTextArticle(url) {
  if (!url) return false;
  return !BLOCKED_PATTERNS.some((pattern) => url.includes(pattern));
}
