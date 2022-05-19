import { CronJob } from "cron";

import { estadao, g1 } from "./scrapers/index.js";
import { Logger, Puppeteer } from "./util/index.js";

const logger = Logger("worker");

logger.info("Starting worker...");

const puppeteer = new Puppeteer({
  defaultViewport: { width: 1920, height: 1080 },
});

const scrapeNewspapers = async () => {
  logger.info("Job started");

  await puppeteer.initialize();

  await estadao(puppeteer);
  await g1(puppeteer);

  logger.info("Job finished");
};

const job = new CronJob("0 * * * * *", scrapeNewspapers);

job.start();
