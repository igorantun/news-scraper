import { Logger, Exporter, Scraper } from "../util/index.js";

const newspaper = {
  name: "UOL",
  slug: "uol",
  url: "https://www.uol.com.br/",
  selectors: {
    headline: {
      element:
        'section[data-area="topo-1"] > .container > .row > .col-24 > .row > .col-24 > .headlineMain',
      link: "a",
      title: ".headlineMain__title",
      summary: ".headlineMain__standfirst",
    },
    article: {
      element: ".headlineSub",
      link: "a",
      title: ".title__element",
    },
  },
};

const uol = async (puppeteer) => {
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

export default uol;
