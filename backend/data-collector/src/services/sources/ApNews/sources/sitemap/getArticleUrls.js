import { parseStringPromise } from "xml2js";

export async function getIndexSitemapUrls({
  baseHttpClient,
  sitemapIndexUrl,
  articlesYear,
}) {
  const { data: indexXml } = await baseHttpClient.get(sitemapIndexUrl);
  const indexData = await parseStringPromise(indexXml);

  return indexData.sitemapindex.sitemap
    .map((s) => s.loc[0])
    .filter((url) => url.includes(articlesYear));
}

export async function getArticleUrlsFromSitemap({
  baseHttpClient,
  sitemapUrl,
}) {
  const { data: monthXml } = await baseHttpClient.get(sitemapUrl);
  const monthData = await parseStringPromise(monthXml);

  return monthData.urlset.url
    .map((u) => u.loc[0])
    .filter((url) => url.includes("/article/") && !url.endsWith("-photo"));
}

export async function getArticleUrls(params) {
  const { articlesPerMonth } = params;

  const sitemaps = await getIndexSitemapUrls(params);

  let allArticleUrls = [];
  for (let i = 0; i < sitemaps.length; i++) {
    const sitemapUrl = sitemaps[i];
    const monthName = sitemapUrl.split("/").pop().replace(".xml", "");

    console.log(`[AP] Processing ${monthName} (${i + 1}/${sitemaps.length})`);

    const articleUrls = await getArticleUrlsFromSitemap({
      ...params,
      sitemapUrl,
    });

    // const monthUrls = articleUrls.slice(0, articlesPerMonth);
    const monthUrls = articleUrls;

    allArticleUrls = [...allArticleUrls, ...monthUrls];
  }

  console.log(allArticleUrls.length);

  return allArticleUrls;
}
