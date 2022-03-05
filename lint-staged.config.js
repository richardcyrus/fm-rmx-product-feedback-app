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
        `eslint --cache --fix --ignore-path .gitignore ${codeFiles.join(" ")}`
      );
    }

    // Format Markdown and JSON files.
    const miscFiles = micromatch(allFiles, ["**/*.md", "**/*.json"]);
    if (miscFiles.length > 0) {
      commands.push(`prettier --write ${miscFiles.join(" ")}`);
    }

    return commands;
  },
};
