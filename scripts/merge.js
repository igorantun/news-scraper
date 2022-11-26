import fs from "fs-extra";

const listFiles = async () => {
  const estadao = await fs.readJSON("results/estadao/estadao-unique.json");
  const folha = await fs.readJSON("results/folha/folha-unique.json");
  const g1 = await fs.readJSON("results/g1/g1-unique.json");
  const uol = await fs.readJSON("results/uol/uol-unique.json");
  const veja = await fs.readJSON("results/veja/veja-unique.json");

  const compiled = [...estadao, ...folha, ...g1, ...uol, ...veja];
  await fs.outputJson(`results/compiled.json`, compiled, {
    spaces: 2,
  });
};

listFiles();
