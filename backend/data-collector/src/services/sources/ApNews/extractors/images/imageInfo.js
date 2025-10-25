import { getBestImageFromSrcset } from "../../../../../utils/images/getBestImageFromSrcset.js";

export function getImageCaption({
  imageType = "carousel",
  $img,
  $slide,
  $figure,
}) {
  let caption = "";

  let captionFromBlock = "";

  const alt = $img.attr("alt") || "";
  const title = $img.attr("title") || "";

  if (imageType === "carousel") {
    const $carouselCaption = $slide
      .find(".CarouselSlide-infoDescription")
      .first();
    if ($carouselCaption.length) {
      captionFromBlock = $carouselCaption.text().trim();
    }
  } else if (imageType === "figure") {
    const $figureCaption = $figure.find("figcaption");
    if ($figureCaption.length) {
      captionFromBlock = $figureCaption.text().trim();
    }
  }

  caption = alt || captionFromBlock || title;

  return caption;
}

export function getImageUrl({ imageType = "carousel", $img, index }) {
  let imageUrl = null;

  let srcset = $img.attr("srcset");

  if (imageType === "carousel" && index != 0) {
    // For first image use "srcset", for others - "data-flickity-lazyload-srcset"
    srcset = $img.attr("data-flickity-lazyload-srcset");
  }

  // Extract from srcset
  if (srcset) {
    const best = getBestImageFromSrcset(srcset);
    if (best && best.url) {
      imageUrl = best.url;
    }
  }

  if (!imageUrl && imageType === "carousel") {
    imageUrl = $img.attr("data-flickity-lazyload");
  }

  if (!imageUrl) {
    imageUrl = $img.attr("src");
  }

  return imageUrl;
}
