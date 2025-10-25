import { AP_IMAGE_DOMAINS } from "../../constants/ApNewsConstants.js";

export function isLogoImage($img) {
  const src = $img.attr("src") || "";
  const alt = $img.attr("alt") || "";
  const classAttr = $img.attr("class") || "";

  return (
    src.toLowerCase().includes("logo") ||
    alt.toLowerCase().includes("logo") ||
    classAttr.toLowerCase().includes("logo")
  );
}

export function isValidImageUrl(imageUrl, otherImages = []) {
  let isImageUrl =
    imageUrl &&
    AP_IMAGE_DOMAINS.some((domain) => imageUrl.includes(domain)) &&
    !imageUrl.startsWith("data:");

  if (otherImages.length != 0) {
    isImageUrl = isImageUrl && !otherImages.some((img) => img.url === imageUrl);
  }

  return isImageUrl;
}
