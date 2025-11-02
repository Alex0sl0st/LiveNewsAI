import { createDefaultImage } from "../../../../../shared.js";
import { extractBestImageFromPicture, getImageCaption } from "./imageInfo.js";

export function extractArticleImages($, articleImageLimit) {
  const images = [];

  $("picture").each((_, el) => {
    const $pic = $(el);
    const bestUrl = extractBestImageFromPicture($pic, $);

    if (!bestUrl) return;
    if (images.some((i) => i.url === bestUrl)) return;

    const caption = getImageCaption($pic);
    if (!caption) return;

    images.push(createDefaultImage({ url: bestUrl, caption }));
  });

  return images.slice(0, articleImageLimit);
}
