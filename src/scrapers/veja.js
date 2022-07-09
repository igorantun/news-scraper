import { Logger, Exporter, Scraper } from "../util/index.js";

const config = {
  name: "VEJA",
  slug: "veja",
  url: "https://veja.abril.com.br/",
  selectors: {
    headline: {
      element: ".card.d",
      link: "a",
      title: "a > .title",
      hat: "a > .category",
      summary: "a > .description",
    },
    article: {
      element: ".card.a",
      link: "a",
      title: ".title",
      hat: ".category",
      summary: ".description",
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

const veja = async (puppeteer, options) => {
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

export default veja;
