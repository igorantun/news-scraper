import fs from "fs-extra";

const slug = "veja";

const sliceReport = async (filename) => {
  const report = await fs.readJson(`results/${slug}/${filename}`);
  const sliced = report.slice(0, 5);
  await fs.outputJson(`results/${slug}/${filename}`, sliced, { spaces: 2 });
};

const listFiles = async () => {
  const files = await fs.readdir(`results/${slug}`);

  const promises = files.map((file) => sliceReport(file));
  await Promise.all(promises);
};

listFiles();
