import { Logger } from "./index.js";

class Scraper {
  constructor({ puppeteer, config }) {
    this.logger = Logger(config.slug, { colorize: true });
    this.name = config.name;
    this.url = config.url;
    this.selectors = config.selectors;

    if (!puppeteer.page || !puppeteer.browser) {
      throw new Error("Puppeteer has not been initialized");
    }

    this.page = puppeteer.page;
    this.browser = puppeteer.browser;
  }

  async scrape({ parser }) {
    this.logger.info(`Started scraping ${this.name}`);

    await this.page.goto(this.url, {
      waitUntil: "load",
    });

    await this.page.evaluate(async () => {
      document.body.scrollIntoView(false);
    });

    const results = await Promise.all(
      Object.entries(this.selectors).map(
        async ([type, selector]) =>
          await this.page.$$eval(selector.element, parser, this.selectors, type)
      )
    );

    return results.flat();
  }
}

export default Scraper;
