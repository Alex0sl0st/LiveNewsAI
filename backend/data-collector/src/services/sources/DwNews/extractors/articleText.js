export function extractArticleText($) {
  const $body = $("article").clone();

  $body
    .find(
      "figure, video, audio, footer, .advertising, .socialMedia, .inArticleTeaser, .ads, .mediaContainer, .mediaPlayer, .col1"
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
