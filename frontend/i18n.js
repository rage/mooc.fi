const I18Next = require("next-i18next/dist/commonjs")

//create new NextI18Next instance
const NextI18Next = new I18Next({
  defaultLanguage: "fi",
  lng: "fi",
  fallbackLng: "en",
  otherLanguages: ["en", "se"],
  localeSubpaths: "foreign",
  returnObjects: true,
  serverLanguageDetection: false,
  debug: true,
  defaultNS: "common",
  detection: {
    order: ["path", "navigator", "querystring"],
    caches: [],
  },
  load: "languageOnly",
})

module.exports = NextI18Next
