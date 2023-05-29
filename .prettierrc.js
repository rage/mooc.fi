// @ts-check
/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
module.exports = {
  printWidth: 80,
  semi: false,
  trailingComma: "all",
  bracketSpacing: true,
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
}
