import fs from "fs-extra";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import config from "../config/config.js";

initializeApp(config.firebase);

const getDateTime = () => {
  const format = (period) =>
    period.map((p) => p.toString().padStart(2, "0")).join("");

  const now = new Date();
  return format([
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
  ]);
};

class Exporter {
  constructor({ newspaper, page, logger }) {
    this.logger = logger;

    this.page = page;
    this.name = newspaper.name;
    this.slug = newspaper.slug;
    this.config = config.exporter;
    this.bucket = getStorage().bucket();

    fs.ensureDirSync(`reports/${this.slug}`);
  }

  async uploadGoogleCloud(filename) {
    await this.bucket.upload(filename, {
      gzip: true,
      destination: filename,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    this.logger.info(`Report "${filename}" uploaded to Google Cloud Storage`);
  }

  async generateHTML(path) {
    await fs.outputFile(`${path}.html`, await this.page.content());

    this.logger.info(`Report "${path}.html" generated`);
  }

  async generateJSON(path, result) {
    await fs.outputJson(`${path}.json`, result, {
      spaces: 2,
    });

    this.logger.info(`Report "${path}.json" generated`);
  }

  async generatePDF(path) {
    await this.page.pdf({
      path: `${path}.pdf`,
      width: "1920px",
      height: "1080px",
      margin: { bottom: 0, left: 0, right: 0, top: 0 },
      printBackground: true,
      pageRanges: "1-10",
    });

    this.logger.info(`Report "${path}.pdf" generated`);
  }

  async generateWEBP(path) {
    await this.page.screenshot({
      path: `${path}.webp`,
      fullPage: true,
      format: "webp",
    });

    this.logger.info(`Report "${path}.webp" generated`);
  }

  async export(result) {
    const id = `${this.slug}-${getDateTime()}`;
    const path = `reports/${this.slug}/${id}`;

    const formats = Object.keys(this.config.formats).filter(
      (format) => this.config.formats[format]
    );

    await Promise.all([
      formats.includes("html") ? this.generateHTML(path) : null,
      formats.includes("json") ? this.generateJSON(path, result) : null,
      formats.includes("pdf") ? this.generatePDF(path) : null,
      formats.includes("webp") ? this.generateWEBP(path) : null,
    ]);

    if (this.config.cloud) {
      const promises = formats.map((format) =>
        this.uploadGoogleCloud(`${path}.${format}`)
      );
      await Promise.all(promises);
    }
  }
}

export default Exporter;
