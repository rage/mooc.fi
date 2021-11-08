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
  publicRuntimeConfig: {
    localeSubpaths:
      typeof process.env.LOCALE_SUBPATHS === "string"
        ? process.env.LOCALE_SUBPATHS
        : "none",
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.FRONTEND_URL,
    NEXT_PUBLIC_PORT: process.env.PORT,
    NEXT_PUBLIC_TMC_HOST: process.env.TMC_HOST,
  },
  trailingSlash: true,
  images: {
    disableStaticImages: true,
    // nextjs 11 supports its own static image imports with next/image -
    // however, we were using next-optimized-images here, so we'll disable
    // it now to avoid refactoring the image loading
  },
  webpack5: true,
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
    withMDX,
  ],
  nextConfiguration,
)
