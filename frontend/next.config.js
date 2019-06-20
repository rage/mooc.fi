const withPlugins = require("next-compose-plugins")
const withTypescript = require("@zeit/next-typescript")
const withFonts = require("next-fonts")
const optimizedImages = require("next-optimized-images")

module.exports = withPlugins([
  withTypescript,
  withFonts,
  [
    optimizedImages,
    {
      handleImages: ["jpeg", "png", "svg"],
      optimizeImages: true,
    },
  ],
])
