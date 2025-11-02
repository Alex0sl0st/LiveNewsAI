import { isValidImageSrc } from "./validation.js";

export function extractBestImageFromPicture($pic, $) {
  let bestUrl = "";
  let maxWidth = 0;

  $pic.find("source[type='image/jpeg']").each((_, source) => {
    const srcset = $(source).attr("srcset");
    if (!srcset) return;

    srcset.split(",").forEach((s) => {
      const [url, size] = s.trim().split(" ");
      const width = parseInt(size) || 0;
      if (width > maxWidth && isValidImageSrc(url)) {
        maxWidth = width;
        bestUrl = url;
      }
    });
  });

  return bestUrl;
}

export function getImageCaption($pic) {
  const $img = $pic.find("img").first();
  return $img.attr("alt") || $img.attr("title") || "";
}
