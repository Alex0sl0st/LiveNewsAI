export function extractArticleText($) {
  const $body = $("article [data-component='text-block']").clone();

  $body.find("a").each((_, a) => $(a).replaceWith($(a).text()));

  const paragraphs = [];

  $body.find("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 1) paragraphs.push(text);
  });

  return paragraphs.join("\n\n").trim();
}
// $(
//   "article noscript, \
//   article .media-player, \
//   article figure, \
//   article [data-component='ad-slot'], \
//   article [data-component='tags'], \
//   article .ssrcss-1kczw0k-PromoGroup"
// ).remove();
