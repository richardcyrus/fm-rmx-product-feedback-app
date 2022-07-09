const micromatch = require("micromatch");

module.exports = {
  "*": (allFiles) => {
    const commands = [];

    // Type check TypeScript files
    const typeScriptFiles = micromatch(allFiles, ["**/*.ts?(x)"]);
    if (typeScriptFiles.length > 0) {
      commands.push("tsc -p tsconfig.json --noEmit");
    }

    // Lint and format TypeScript and JavaScript files.
    const codeFiles = micromatch(allFiles, ["**/*.[tj]s?(x)"]);
    if (codeFiles.length > 0) {
      commands.push(
        `eslint --cache --cache-location ./node_modules/.cache/eslint --fix --ignore-path .gitignore ${codeFiles.join(
          " "
        )}`
      );
    }

    // Lint and fix PostCSS files with Stylelint
    const postCssFiles = micromatch(allFiles, ["**/*.pcss"]);
    if (postCssFiles.length > 0) {
      commands.push(
        `stylelint ${postCssFiles.join(
          " "
        )} --cache --cache-location ./node_modules/.cache/stylelint --fix`
      );
    }

    // Format Markdown, JSON, and PostCSS files.
    const miscFiles = micromatch(allFiles, [
      "**/*.md",
      "**/*.json",
      "**/*.pcss",
    ]);
    if (miscFiles.length > 0) {
      commands.push(`prettier --write ${miscFiles.join(" ")}`);
    }

    return commands;
  },
};
