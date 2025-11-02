import { DW_IMAGE_DOMAINS } from "../../constants/dwConstants.js";

export function isValidImageSrc(src) {
  return DW_IMAGE_DOMAINS.some((domain) => src.includes(domain));
}
