export function getBestImageFromSrcset(srcset) {
  if (!srcset) return null;

  const sources = srcset.split(",").map((s) => s.trim());
  let bestUrl = "";
  let maxWidth = 0;

  sources.forEach((source) => {
    const parts = source.split(" ");
    const url = parts[0];

    // Parse width (can be "1x", "2x" or number)
    const widthStr = parts[1];
    let width = 0;

    if (widthStr.endsWith("x")) {
      // "1x" or "2x" - multiply by 599 (base width)
      const multiplier = parseFloat(widthStr);
      width = multiplier * 599;
    } else {
      width = parseInt(widthStr) || 0;
    }

    if (width > maxWidth) {
      maxWidth = width;
      bestUrl = url;
    }
  });

  return { url: bestUrl, width: maxWidth };
}
