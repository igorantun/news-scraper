import fs from "fs-extra";
import { cert } from "firebase-admin/app";

const config = {
  cron: "0 */2 * * * *",
  exporter: {
    cloud: false,
    formats: {
      html: true,
      json: true,
      pdf: true,
      webp: true,
    },
  },
  firebase: {
    credential: cert(
      await fs.readJsonSync("./src/config/serviceAccountKey.json")
    ),
    storageBucket: "news-scraper-tcc.appspot.com",
  },
  puppeteer: {
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox"],
  },
};

export default config;
