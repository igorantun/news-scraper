import { CronJob } from "cron";

import config from "./config/config.js";
import { estadao, folha, g1, uol, veja } from "./scrapers/index.js";
import { Logger, Puppeteer } from "./util/index.js";

const logger = Logger("worker");

logger.info("Worker started");

const puppeteer = new Puppeteer(config.puppeteer);

const job = new CronJob(config.cron, scrapeNewspapers);

async function scrapeNewspapers() {
  logger.info("Job started");

  await puppeteer.initialize();

  await estadao(puppeteer);
  await folha(puppeteer);
  await g1(puppeteer);
  await uol(puppeteer);
  await veja(puppeteer);

  logger.info("Job finished");
  logNextRuns();
}

const logNextRuns = () => {
  const nextRuns = job
    .nextDates(3)
    .map((date) =>
      new Intl.DateTimeFormat("pt-BR", {
        dateStyle: undefined,
        timeStyle: "long",
      }).format(date)
    )
    .join(", ");

  logger.debug(`Next runs: ${nextRuns}`);
};

console.log("Starting job...");
job.start();
logNextRuns();
