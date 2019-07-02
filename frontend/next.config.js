const withPlugins = require("next-compose-plugins")
const withTypescript = require("@zeit/next-typescript")
const withFonts = require("next-fonts")
const withOptimizedImages = require("next-optimized-images")
const sharp = require("responsive-loader/sharp")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withCSS = require("@zeit/next-css")

module.exports = withPlugins([
  withFonts,
  withTypescript,
  [
    withOptimizedImages,
    {
      handleImages: ["jpeg", "png", "svg", "webp", "gif"],
      overwriteImageLoaderPaths: require.resolve.paths("")[0],
      optimizeImages: true,
      optimizeImagesInDev: true,
      webp: {
        preset: "default",
        quality: 75,
      },
      responsive: {
        adapter: sharp,
        placeholder: true,
        placeholderSize: 50,
        optimizeImagesInDev: true,
      },
    },
  ],
  withBundleAnalyzer,
  withCSS,
])
