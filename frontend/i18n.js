const I18Next = require("next-i18next/dist/commonjs")

//create new NextI18Next instance
const NextI18Next = new I18Next({
  defaultLanguage: "fi",
  otherLanguages: ["en"],
  localeSubpaths: "all",
  debug: true,
  localeExtension: "JSON",
  returnObjects: true,
  browserLanguageDetection: false,
})

module.exports = NextI18Next
