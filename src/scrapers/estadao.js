import { Logger, Exporter, Scraper } from "../util/index.js";

const newspaper = {
  name: "Estadão",
  slug: "estadao",
  url: "https://www.estadao.com.br/",
  selectors: {
    headline: {
      element: ".-principal",
      link: "a",
      hat: ".chapeu",
      title: ".title",
      summary: ".linha-fina",
    },
    article: {
      element:
        "section.breaking-news-rodape > div > div > div > article, section.manchete-2 > div > div > div > article, section.manchete-3 > div > div > div > article",
      link: "a",
      hat: ".chapeu",
      title: ".title",
      summary: ".linha-fina",
    },
  },
};

const estadao = async (puppeteer) => {
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

export default estadao;
