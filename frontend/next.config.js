const withPlugins = require("next-compose-plugins")
const withTypescript = require("@zeit/next-typescript")
const withFonts = require("next-fonts")
const withOptimizedImages = require("next-optimized-images")
const sharp = require("responsive-loader/sharp")

module.exports = withPlugins([
  withTypescript,
  withFonts,
  [
    withOptimizedImages,
    {
      overwriteImageLoaderPaths: require.resolve.paths("")[0],
      optimizeImages: true,

      responsive: {
        adapter: sharp,
        sizes: [300, 600, 1200, 2000],
        placeholder: true,
        placeholderSize: 50,
        optimizeImagesInDev: true,
      },
    },
  ],
])
