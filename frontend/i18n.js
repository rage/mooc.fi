const NextI18Next = require('next-i18next/dist/commonjs')
const Fluent = require('i18next-fluent')

//create new NextI18Next instance
//and set it to use fluent syntax
module.exports = new NextI18Next({
  defaultLanguage: 'fi',
  otherLanguages: ['en'],
  localeSubpaths: 'foreign',
})
 