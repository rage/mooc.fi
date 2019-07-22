const I18Next = require("next-i18next/dist/commonjs").default

//create new NextI18Next instance
const NextI18Next = new I18Next({
  defaultLanguage: "fi",
  fallbackLng: "fi",
  otherLanguages: ["en", "se"],
  localeSubpaths: "foreign",
  returnObjects: true,
  defaultNS: "common",
  detection: {
    order: ["path"],
    caches: [],
  },
  load: "languageOnly",
})

module.exports = NextI18Next
