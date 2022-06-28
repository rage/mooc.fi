module.exports = {
  printWidth: 80,
  semi: false,
  trailingComma: "all",
  bracketSpacing: true,
  importOrder: [
    "^react(-dom)?$",
    "^node:",
    "<THIRD_PARTY_MODULES>",
    "",
    "^[./]",
  ],
  plugins: [require.resolve("@ianvs/prettier-plugin-sort-imports")],
  importOrderBuiltinModulesToTop: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderSeparation: true,
  importOrderParserPlugins: [
    "typescript",
    "jsx",
    "classProperties",
    "decorators-legacy",
  ],
}
