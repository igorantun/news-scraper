import { Logger, Exporter, Scraper } from "../util/index.js";

const newspaper = {
  name: "g1",
  slug: "g1",
  url: "https://g1.globo.com/",
  selectors: {
    headline: {
      element: ".bstn-hl-wrapper",
      link: "a",
      hat: ".bstn-hl-chapeuitem",
      title: ".bstn-hl-title",
      summary: ".bstn-hl-summary",
    },
    article: {
      element: '[data-type="materia"]',
      link: "a",
      hat: ".feed-post-header-chapeu",
      title: "a",
      summary: ".feed-post-body-resumo",
      category: ".feed-post-metadata-section",
    },
  },
};

const g1 = async (puppeteer) => {
  const logger = Logger(newspaper.slug);

  const scraper = new Scraper({
    puppeteer,
    newspaper,
  });

  const exporter = new Exporter({
    logger,
    newspaper,
    page: scraper.page,
  });

  const result = await scraper.scrape();
  await exporter.export(result);
};

export default g1;
