export function extractArticleText($) {
  const $body = $("main .Page-storyBody").clone();

  $body
    .find(
      ".Page-below, .Page-authorInfo, .FreeStar, .Advertisement, .HTMLModuleEnhancement, .Enhancement, figure, video, audio, footer, aside, script, noscript, .Ad, .ad, .advert, .advertisement, .ArticleHeader"
    )
    .remove();

  $body.find("a").each((_, a) => $(a).replaceWith($(a).text()));

  const paragraphs = [];
  $body.find("h2, h3, p").each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 1) paragraphs.push(text);
  });

  return paragraphs.join("\n\n").trim();
}
