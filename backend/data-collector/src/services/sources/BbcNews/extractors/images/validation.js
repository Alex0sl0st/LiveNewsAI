import { BBC_IMAGE_DOMAINS } from "../../constants/bbcConstants.js";

export function isValidImage(url, alt, caption) {
  return caption && !isBlockedImage(alt, url);
}

export function isValidImageUrl(url) {
  return url && BBC_IMAGE_DOMAINS.some((domain) => url.includes(domain));
}

export function isBlockedImage(alt, url) {
  const lowerAlt = alt?.toLowerCase() || "";
  return (
    lowerAlt.includes("presentational") ||
    url.includes("placeholder") ||
    url.includes("bbc-blocks")
  );
}
