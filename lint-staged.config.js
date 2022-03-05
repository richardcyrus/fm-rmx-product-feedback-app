const micromatch = require("micromatch");

module.exports = {
  "*": (allFiles) => {
    // Lint and format TypeScript and JavaScript files.
    const codeFiles = micromatch(allFiles, ["**/*.[tj]s?(x)"]);
    // Format Markdown and JSON files.
    const miscFiles = micromatch(allFiles, ["**/*.md", "**/*.json"]);
    return [
      "tsc -p tsconfig.json --noEmit",
      `eslint --cache --fix --ignore-path .gitignore ${codeFiles.join(" ")}`,
      `prettier --write ${miscFiles.join(" ")}`,
    ];
  },
};
