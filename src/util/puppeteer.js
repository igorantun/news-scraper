import puppeteer from "puppeteer-extra";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

import { Logger } from "./index.js";

puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

class Puppeteer {
  constructor(config) {
    this.logger = Logger("puppeteer");

    this.config = config;
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      this.logger.debug("Initializing Puppeteer...");

      this.browser = await puppeteer.launch(this.config);
      this.page = await this.browser.newPage();
      this.initialized = true;

      this.logger.debug("Puppeteer initialized");
    }
  }

  async close() {
    if (this.initialized) {
      this.logger.debug("Closing Puppeteer...");

      await this.browser.close();
      this.initialized = false;

      this.logger.debug("Puppeteer closed");
    }
  }
}

export default Puppeteer;
