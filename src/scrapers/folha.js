import { Logger, Exporter, Scraper } from "../util/index.js";

const newspaper = {
  name: "Folha de S.Paulo",
  slug: "folha",
  url: "https://www.folha.uol.com.br/",
  selectors: {
    headline: {
      element: ".c-main-headline",
      link: ".c-main-headline__url",
      hat: ".c-main-headline__kicker",
      title: ".c-main-headline__title",
      summary: ".c-main-headline__standfirst",
    },
    article: {
      element: ".c-headline",
      link: ".c-headline__url, .c-headline-thumb__url",
      hat: ".c-headline__kicker",
      title: ".c-headline__title, .c-headline-thumb__title",
      summary: ".c-headline__standfirst",
    },
  },
};

const folha = async (puppeteer) => {
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

export default folha;
