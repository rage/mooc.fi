const I18Next = require("next-i18next/dist/commonjs")

//create new NextI18Next instance
const NextI18Next = new I18Next({
  lng: "fi",
  debug: true,

  load: "languageOnly",
  defaultLanguage: "fi",
  otherLanguages: ["en"],
  localeSubpaths: "foreign",
  returnObjects: true,
  browserLanguageDetection: false,
  preload: ["fi", "en"],
})

module.exports = NextI18Next
