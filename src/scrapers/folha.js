import { Logger, Exporter, Scraper } from "../util/index.js";

const config = {
  name: "Folha de S.Paulo",
  slug: "folha",
  url: "https://www.folha.uol.com.br/",
  selectors: {
    headline: {
      element:
        "#conteudo > .page > .block > .container > .row > .col > .c-main-headline",
      link: ".c-main-headline__url",
      title: ".c-main-headline__title",
      hat: ".c-main-headline__kicker",
      summary: ".c-main-headline__standfirst",
    },
    article: {
      element: ".c-headline",
      link: ".c-headline__url",
      title: ".c-headline__title",
      hat: ".c-headline__kicker",
      summary: ".c-headline__standfirst",
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

const folha = async (puppeteer, options) => {
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

export default folha;
