// @ts-check
/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
  printWidth: 80,
  semi: false,
  trailingComma: "all",
  bracketSpacing: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "<BUILTIN_MODULES>",
    "^react(-dom)?$",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^[@]",
    "",
    "^[./](?!graphql)",
    "",
    "^/graphql",
  ],
  importOrderParserPlugins: [
    "typescript",
    "jsx",
    "classProperties",
    "decorators-legacy",
  ],
  importOrderTypeScriptVersion: "5.0.0",
}

module.exports = config
