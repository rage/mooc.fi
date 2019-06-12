const withPlugins = require("next-compose-plugins")
const withTypescript = require("@zeit/next-typescript")
const withFonts = require("next-fonts")
const withImages = require("next-images")

module.exports = withPlugins([withTypescript, withFonts, withImages])
