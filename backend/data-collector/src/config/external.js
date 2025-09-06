import "dotenv/config";

export const newsSourcesConfig = {
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
