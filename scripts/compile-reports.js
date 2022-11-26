import fs from "fs-extra";

const slug = "veja";

const reports = [];
const unique = new Map();

const saveResult = async () => {
  await fs.outputJson(`results/${slug}/${slug}-compiled.json`, reports, {
    spaces: 2,
  });
};

const saveUnique = async () => {
  const ordered = [...unique.values()].sort((a, b) => b.score - a.score);

  await fs.outputJson(`results/${slug}/${slug}-unique.json`, ordered, {
    spaces: 2,
  });
};

const parseDate = (date) => {
  const regex = RegExp(/(\d{4})(\d{2})(\d{2})(\d{2})/g);
  const [_, year, month, day, hour] = regex.exec(date);
  const parsed = new Date(`${year} ${month} ${day} ${hour}:00:00 GMT`);

  return parsed;
};

const pushReport = async (filename) => {
  if (!filename.includes(".json")) return;

  const report = await fs.readJson(`results/${slug}/${filename}`);
  const date = parseDate(filename);

  const complete = report.map((article, index) => {
    const previous = unique.get(article.link);
    const appearances = (previous || { appearances: 0 }).appearances + 1;
    const positions = (previous || { positions: [] }).positions.concat(index);

    unique.set(article.link, {
      link: article.link,
      appearances,
      positions,
      score: positions.reduce((acc, curr) => acc + (5 - curr), 0),
    });

    return { ...article, date, index };
  });

  reports.push(...complete);
};

const listFiles = async () => {
  await fs.rm(`results/${slug}/${slug}-compiled.json`, { force: true });
  await fs.rm(`results/${slug}/${slug}-unique.json`, { force: true });

  const files = await fs.readdir(`results/${slug}`);

  const promises = files.map((file) => pushReport(file));
  await Promise.all(promises);

  console.log(reports.length);
  await saveResult();

  console.log(unique.size);
  await saveUnique();
};

listFiles();
