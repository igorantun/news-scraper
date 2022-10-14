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

  // Estadão
  try {
    await estadao(puppeteer);
  } catch (error) {
    console.error(error);
  }

  // g1
  try {
    await g1(puppeteer);
  } catch (error) {
    console.error(error);
  }

  // UOL
  try {
    await uol(puppeteer);
  } catch (error) {
    console.error(error);
  }

  // VEJA
  try {
    await veja(puppeteer);
  } catch (error) {
    console.error(error);
  }

  // Folha
  try {
    await folha(puppeteer);
  } catch (error) {
    console.error(error);
  }

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

const start = async () => {
  await puppeteer.initialize();

  console.log("Starting job...");
  job.start();

  logNextRuns();
};

start();
