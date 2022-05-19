import { Logger, Exporter, Scraper } from "../util/index.js";

const config = {
  name: "g1",
  slug: "g1",
  url: "https://g1.globo.com/",
  selectors: {
    headline: {
      element: ".bstn-hl-wrapper",
      title: ".bstn-hl-title",
      hat: ".bstn-hl-chapeuitem",
      summary: ".bstn-hl-summary",
    },
    article: {
      element: '[data-type="materia"]',
      title: "a",
      hat: ".feed-post-header-chapeu",
      summary: ".feed-post-body-resumo",
      category: ".feed-post-metadata-section",
    },
  },
};

const parser = (elements, selectors, type) =>
  elements.map((element, position) => {
    const { top, left, height, width } = element.getBoundingClientRect();

    return {
      type,
      position,
      link: element.querySelector("a").href,
      hat: element.querySelector(selectors[type].hat)?.textContent,
      title: element.querySelector(selectors[type].title).textContent,
      summary: element.querySelector(selectors[type].summary)?.textContent,
      category: element.querySelector(selectors[type].category)?.innerText,
      coordinates: { top, left, height, width },
    };
  });

const g1 = async (puppeteer, options) => {
  const logger = Logger(config.slug, { colorize: true });

  const scraper = new Scraper({
    puppeteer,
    config,
  });

  const exporter = new Exporter({
    config,
    page: scraper.page,
    logger,
    formats: options,
  });

  const result = await scraper.scrape({ parser });

  await exporter.export({ id: config.slug, result });
};

export default g1;
