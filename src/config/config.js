import { cert } from "firebase-admin/app";
import serviceAccountKey from "./serviceAccountKey.js";

const serviceAccount = serviceAccountKey;

serviceAccount.private_key = serviceAccount.private_key?.replace(/\\n/gm, "\n");

const config = {
  cron: "0 0 * * * *",
  exporter: {
    cloud: true,
    formats: {
      html: true,
      json: true,
      pdf: true,
      webp: true,
    },
  },
  firebase: {
    credential: cert(serviceAccount),
    storageBucket: "news-scraper-tcc.appspot.com",
  },
  puppeteer: {
    defaultViewport: { width: 1920, height: 1080 },
    args: ["--no-sandbox"],
  },
};

export default config;
