const I18Next = require("next-i18next/dist/commonjs")

//create new NextI18Next instance
const NextI18Next = new I18Next({
  defaultLanguage: "fi",
  otherLanguages: ["en"],
  localeSubpaths: "foreign",
  debug: true,
  localeExtension: "JSON",
})

console.log(NextI18Next.config)
module.exports = NextI18Next
