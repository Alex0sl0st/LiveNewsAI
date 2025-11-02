export async function parseRSSFeed(parser, rssUrl) {
  const feed = await parser.parseURL(rssUrl);
  return feed.items;
}
