const I18Next = require("next-i18next/dist/commonjs")

//create new NextI18Next instance
const NextI18Next = new I18Next({
  lng: "fi",
  defaultLanguage: "fi",
  otherLanguages: ["en"],
  localeSubpaths: "foreign",
  returnObjects: true,
  debug: true,
  browserLanguageDetection: false,
})

module.exports = NextI18Next
