import { getBestImageFromSrcset } from "../../../../../utils/images/getBestImageFromSrcset.js";

export function getImageUrl($el) {
  return (
    $el.attr("src") ||
    $el.attr("data-src") ||
    getBestImageFromSrcset($el.attr("srcset"))?.url ||
    ""
  );
}

export function getImageCaption($fig, alt) {
  const caption = $fig.find("figcaption").text().trim() || alt.trim() || "";

  return caption;
}

// function getBestSrcFromSrcsetLocal(srcset) {
//   return (
//     srcset
//       ?.split(",")
//       .map((s) => s.trim().split(" ")[0])
//       .pop() || null
//   );
// }
