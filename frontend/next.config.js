const withPlugins = require("next-compose-plugins")
const withFonts = require("next-fonts")
const withOptimizedImages = require("next-optimized-images")
const sharp = require("responsive-loader/sharp")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
// const withCSS = require("@zeit/next-css")
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
})

const nextConfiguration = {
  images: {
    disableStaticImages: true,
  },
  publicRuntimeConfig: {
    localeSubpaths:
      typeof process.env.LOCALE_SUBPATHS === "string"
        ? process.env.LOCALE_SUBPATHS
        : "none",
  },
  trailingSlash: true,
  i18n: {
    locales: ["en", "fi"],
    defaultLocale: "fi",
  },
}

module.exports = withPlugins(
  [
    withFonts,
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
        inlineImageLimit: -1,
        responsive: {
          adapter: sharp,
          placeholder: true,
          placeholderSize: 50,
          optimizeImagesInDev: true,
        },
      },
    ],
    withBundleAnalyzer,
    // withCSS,
    [
      withMDX,
      {
        pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
      },
    ],
  ],
  nextConfiguration,
)
