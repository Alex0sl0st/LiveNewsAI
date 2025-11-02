import { isValidImage, isValidImageUrl } from "./validation.js";
import { createDefaultImage } from "../../../../../shared.js";
import { getImageUrl } from "./imageInfo.js";
import { getImageCaption } from "./imageInfo.js";

export function extractArticleMedia($, articleImageLimit) {
  const mediaImages = [];

  $("article figure").each((_, fig) => {
    const $fig = $(fig);
    const img = $fig
      .find("img")
      .filter((_, el) => {
        const thisUrl = getImageUrl($(el));
        return isValidImageUrl(thisUrl);
      })
      .first();

    if (!img.length) return;

    const url = getImageUrl(img);
    if (!isValidImageUrl(url)) return;

    const alt = img.attr("alt") || "";
    const caption = getImageCaption($fig, alt);

    if (!isValidImage(url, alt, caption)) return;

    mediaImages.push(createDefaultImage({ url, caption }));
  });

  return mediaImages.slice(0, articleImageLimit);
}
