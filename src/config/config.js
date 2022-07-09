const config = {
  exporter: {
    cloud: true,
    formats: {
      html: true,
      json: true,
      pdf: true,
      webp: true,
    },
  },
  cron: "0 0 * * * *",
};

export default config;
