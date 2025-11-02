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

  ap: {
    name: "AP",
    urls: {
      sitemapIndex: "https://apnews.com/sitemap.xml",
    },
  },
};

export const getSourceConfig = (sourceName) => {
  return newsSourcesConfig[sourceName];
};

export const getAvailableSources = () => {
  return Object.keys(newsSourcesConfig);
};
