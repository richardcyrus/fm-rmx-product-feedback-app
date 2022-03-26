module.exports = {
  extends: ["plugin:chai-friendly/recommended", "plugin:cypress/recommended"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
