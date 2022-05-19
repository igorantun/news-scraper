import { Logger, Exporter, Scraper } from "../util/index.js";

const config = {
  name: "Estadão",
  slug: "estadao",
  url: "https://www.estadao.com.br/",
  selectors: {
    headline: {
      element: ".-principal",
      title: ".title",
      hat: ".chapeu",
      summary: ".linha-fina",
    },
    article: {
      element:
        "section.breaking-news-rodape > div > div > div > article, section.manchete-2 > div > div > div > article, section.manchete-3 > div > div > div > article",
      title: ".title",
      hat: ".chapeu",
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
      hat: element.querySelector(selectors[type].hat)?.innerText?.trim(),
      title: element.querySelector(selectors[type].title).innerText,
      summary: element.querySelector(selectors[type].summary)?.innerText,
      coordinates: { top, left, height, width },
    };
  });

const estadao = async (puppeteer, options) => {
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

export default estadao;
