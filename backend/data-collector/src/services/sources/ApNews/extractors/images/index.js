import { isLogoImage, isValidImageUrl } from "./validation.js";
import { getImageUrl, getImageCaption } from "./imageInfo.js";

export function extractArticleImages({ $, articleImageLimit }) {
  const images = [];
  const $pageLead = $(".Page-lead");

  if ($pageLead.length === 0) return images;

  // Check if there's a carousel
  const $carousel = $pageLead.find(".Carousel");
  const hasCarousel = $carousel.length > 0;

  if (hasCarousel) {
    // STRATEGY 1: Carousel
    $pageLead.find(".CarouselSlide").each((i, slide) => {
      const $slide = $(slide);
      const $img = $slide.find("img").first();

      if (isLogoImage($img)) return;

      const imageUrl = getImageUrl({ imageType: "carousel", $img, index: i });

      if (!isValidImageUrl(imageUrl, images)) return;

      const caption = getImageCaption({ imageType: "carousel", $slide, $img });

      images.push({
        url: imageUrl,
        caption: caption,
      });
    });
  } else {
    // STRATEGY 2: Figure
    $pageLead.find("figure").each((i, fig) => {
      const $figure = $(fig);
      const $img = $figure.find("img").first();

      if (isLogoImage($img)) return;

      const imageUrl = getImageUrl({ imageType: "figure", $img });

      if (!isValidImageUrl(imageUrl)) return;

      const caption = getImageCaption({ imageType: "figure", $img, $figure });

      images.push({
        url: imageUrl,
        caption: caption,
      });
    });
  }

  return images.slice(0, articleImageLimit);
}
