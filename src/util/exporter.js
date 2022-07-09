import fs from "fs-extra";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

initializeApp({
  credential: cert(
    await fs.readJsonSync("./src/config/serviceAccountKey.json")
  ),
  storageBucket: "news-scraper-tcc.appspot.com",
});

const defaultOptions = {
  cloud: false,
  formats: {
    html: true,
    json: true,
    pdf: true,
    webp: true,
  },
};

class Exporter {
  constructor({ config, page, logger, options }) {
    this.logger = logger;

    this.page = page;
    this.name = config.name;
    this.slug = config.slug;
    this.options = options || defaultOptions;
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

    this.logger.info(`${filename} uploaded to Google Cloud Storage`);
  }

  async generateHTML(path) {
    await fs.outputFile(`${path}.html`, await this.page.content());

    this.logger.info(`"${path}.html" generated`);
  }

  async generateJSON(path, result) {
    await fs.outputJson(`${path}.json`, result, {
      spaces: 2,
    });

    this.logger.info(`"${path}.json" generated`);
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

    this.logger.info(`"${path}.pdf" generated`);
  }

  async generateWEBP(path) {
    await this.page.screenshot({
      path: `${path}.webp`,
      fullPage: true,
      format: "webp",
    });

    this.logger.info(`"${path}.webp" generated`);
  }

  async export({ result }) {
    const id = new Date().toISOString();
    const path = `reports/${this.slug}/${id}`;
    const formats = Object.keys(this.options.formats).filter(
      (format) => this.options.formats[format]
    );

    await Promise.all([
      formats.includes("html") ? this.generateHTML(path) : null,
      formats.includes("json") ? this.generateJSON(path, result) : null,
      formats.includes("pdf") ? this.generatePDF(path) : null,
      formats.includes("webp") ? this.generateWEBP(path) : null,
    ]);

    if (this.options.cloud) {
      const promises = formats.map((format) =>
        this.uploadGoogleCloud(`${path}.${format}`)
      );
      await Promise.all(promises);
    }
  }
}

export default Exporter;
