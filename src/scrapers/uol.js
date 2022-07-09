import { Logger, Exporter, Scraper } from "../util/index.js";

const config = {
  name: "UOL",
  slug: "uol",
  url: "https://www.uol.com.br/",
  selectors: {
    headline: {
      element:
        'section[data-area="topo-1"] > .container > .row > .col-24 > .row > .col-24 > .headlineMain',
      link: "a",
      title: ".headlineMain__title",
    },
    article: {
      element: ".headlineSub",
      link: "a",
      title: ".title__element",
    },
  },
};

const parser = (elements, selectors, type) =>
  elements.map((element, position) => {
    const { top, left, height, width } = element.getBoundingClientRect();

    return {
      type,
      position,
      link: element.querySelector(selectors[type].link)?.href,
      hat: element.querySelector(selectors[type].hat)?.textContent?.trim(),
      title: element.querySelector(selectors[type].title)?.textContent.trim(),
      summary: element.querySelector(selectors[type].summary)?.textContent,
      coordinates: { top, left, height, width },
    };
  });

const uol = async (puppeteer, options) => {
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

export default uol;
