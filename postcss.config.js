module.exports = function (cfg) {
  const dev = cfg.env === "development";

  return {
    map: dev ? { inline: true } : false,
    plugins: [
      require("postcss-import"),
      require("postcss-nested"),
      require("postcss-sort-media-queries"),
      require("autoprefixer"),
      dev ? null : require("cssnano")({ preset: "default" }),
    ],
  };
};
