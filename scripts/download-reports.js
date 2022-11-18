import fs from "fs-extra";
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import config from "../src/config/config.js";
initializeApp(config.firebase);

const slug = "veja";
const bucket = getStorage().bucket();
const startDate = new Date("2022-10-16 GMT-0300");
const endDate = new Date("2022-11-13 00:30:00 GMT-0300");

fs.ensureDirSync(`results/${slug}`);

const downloadFile = async (file) => {
  const fileName = file.name.split("/").pop();
  const exists = await fs.pathExists(`results/${slug}/${fileName}`);
  if (exists) {
    console.log(`${fileName} already exists`);
    return;
  }

  await file.download({ destination: `results/${slug}/${fileName}` });
  console.log(`Downloaded ${fileName}`);
};

const listFiles = async () => {
  const options = {
    prefix: `reports/${slug}/`,
  };

  const [files] = await bucket.getFiles(options);

  const reports = files.filter((file) => {
    const isJson = file.name.endsWith(".json");
    const date = new Date(file.metadata.timeCreated);
    const isInTimeRange = date >= startDate && date <= endDate;

    return isJson && isInTimeRange;
  });

  console.log(`Downloading ${reports.length} files`);
  const promises = reports.map((file) => downloadFile(file));
  await Promise.all(promises);
};

listFiles();
