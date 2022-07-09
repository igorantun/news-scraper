import { Logger } from "./index.js";

const parser = (elements, selectors, type) =>
  elements.map((element, position) => {
    const { top, left, height, width } = element.getBoundingClientRect();

    const result = {
      type,
      position,
      coordinates: { top, left, height, width },
      link:
        element.querySelector(selectors.link)?.href ||
        element.getAttribute("href"),
    };

    for (let [property, selector] of Object.entries(selectors)) {
      if (property !== "element" && property !== "link") {
        result[property] = element.querySelector(selector)?.textContent.trim();
      }
    }

    return result;
  });

class Scraper {
  constructor({ puppeteer, newspaper }) {
    this.logger = Logger(newspaper.slug, { colorize: true });
    this.url = newspaper.url;
    this.name = newspaper.name;
    this.selectors = newspaper.selectors;

    if (!puppeteer.page || !puppeteer.browser) {
      throw new Error("Puppeteer has not been initialized");
    }

    this.page = puppeteer.page;
    this.browser = puppeteer.browser;
  }

  async scrape() {
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
          await this.page.$$eval(
            selector.element,
            parser,
            this.selectors[type],
            type
          )
      )
    );

    return results.flat();
  }
}

export default Scraper;
