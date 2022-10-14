import { Logger, Exporter, Scraper } from "../util/index.js";

const newspaper = {
  name: "Estadão",
  slug: "estadao",
  url: "https://www.estadao.com.br/",
  selectors: {
    headline: {
      element: ".manchete-dia-a-dia-block-container,.manchete-especial",
      link: "a",
      hat: ".chapeu,.manchete-especial-badge",
      title: ".headline",
      summary: ".subheadline",
    },
    article: {
      element: ".noticia-single-block",
      link: "a",
      hat: ".chapeu",
      title: ".headline",
      summary: ".subheadline",
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
