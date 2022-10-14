import { Logger, Exporter, Scraper } from "../util/index.js";

const newspaper = {
  name: "VEJA",
  slug: "veja",
  url: "https://veja.abril.com.br/",
  selectors: {
    headline: {
      element: ".card.d",
      link: "a",
      hat: "a > .category",
      title: "a > .title",
      summary: "a > .description",
    },
    article: {
      element: ".card.a,.card.b",
      hat: ".category",
      title: ".title",
      summary: ".description",
    },
  },
};

const veja = async (puppeteer) => {
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

export default veja;
