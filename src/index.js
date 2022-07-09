import { CronJob } from "cron";

import { estadao, folha, g1, uol, veja } from "./scrapers/index.js";
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
  await folha(puppeteer);
  await g1(puppeteer);
  await uol(puppeteer);
  await veja(puppeteer);

  logger.info("Job finished");
};

const job = new CronJob("*/60 */1 * * * *", scrapeNewspapers);

job.start();
