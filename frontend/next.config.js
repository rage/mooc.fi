const withTypescript = require("@zeit/next-typescript")
const withFonts = require("next-fonts")
module.exports = withFonts(withTypescript())
