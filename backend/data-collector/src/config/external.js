import "dotenv/config";

export const newsSourcesConfig = {
  bbc: {
    name: "BBC",
    urls: { rss: "https://feeds.bbci.co.uk/news/rss.xml" },
  },

  dw: {
    name: "DW",
    urls: {
      rss: "https://rss.dw.com/rdf/rss-en-all",
    },
  },

  newsApi: {
    name: "NewsAPI.org",
    baseUrl: "https://newsapi.org/v2",
    apiKey: process.env.NEWS_API_KEY,
    endpoints: {
      topHeadlines: "/top-headlines",
      everything: "/everything",
      sources: "/sources",
    },
  },
};

export const newsAPIbaseUrl = newsSourcesConfig.newsApi.baseUrl;
export const newsAPIKey = newsSourcesConfig.newsApi.apiKey;

export const getSourceConfig = (sourceName) => {
  return newsSourcesConfig[sourceName];
};

export const getAvailableSources = () => {
  return Object.keys(newsSourcesConfig);
};
