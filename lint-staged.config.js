import micromatch from "micromatch";

export default {
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
        `eslint --fix ${codeFiles.join(" ")}`
      );
    }

    // Format Markdown, JSON, and CSS files.
    const miscFiles = micromatch(allFiles, [
      "**/*.md",
      "**/*.json",
      "**/*.css",
    ]);
    if (miscFiles.length > 0) {
      commands.push(`prettier --write ${miscFiles.join(" ")}`);
    }

    // Lint and fix CSS files with Stylelint
    const postCssFiles = micromatch(allFiles, ["**/*.css"]);
    if (postCssFiles.length > 0) {
      commands.push(
        `stylelint ${postCssFiles.join(
          " "
        )} --cache --cache-location ./node_modules/.cache/stylelint --fix`
      );
    }

    return commands;
  },
};
