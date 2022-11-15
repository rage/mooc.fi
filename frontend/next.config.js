// @ts-check
/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {((config?: NextConfig) => NextConfig) | ((config: NextConfig) => NextConfig)} NextPlugin
 */
// const withFonts = require("next-fonts")
// const withOptimizedImages = require("next-optimized-images")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
/** @type {NextPlugin} */
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
})

/**
 * @type NextConfig}
 */
const nextConfiguration = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.mooc.fi",
        pathname: "/**",
      },
    ],
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
  compiler: {
    emotion: {
      // would label things with [local] or something; will break styling if not set to never
      autoLabel: "never",
    },
  },
  experimental: {
    // enabling emotion here will allow for components to be used as selectors
    // ie. assuming there's a Card component we can do styled.div`${Card} + ${Card} { padding-top: 0.5rem; }`
    modularizeImports: {
      "@mui/material": {
        transform: "@mui/material/{{member}}",
      },
      "@mui/icons-material/?(((\\w*)?/?)*)": {
        transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
      },
      lodash: {
        transform: "lodash/{{member}}",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/, // (svg|png|jpeg|jpg|gif|webp)
      type: "asset",
    })
    config.module.rules.push({
      test: /\.(png|jpg|gif|webp)$/,
      exclude: ["/public/images/originals/", "/public/images/courseimages/"],
    })
    config.module.rules.push({
      test: /\.svg/,
      issuer: /\.[jt]sx?$/,
      resourceQuery: /component/,
      // include: [options.dir],
      use: [
        "next-swc-loader",
        {
          loader: "@svgr/webpack",
          options: { babel: false },
        },
      ],
    })

    return config
  },
}

module.exports = () => {
  /**
   * @type {(
   *  NextPlugin |
   *   [typeof withMDX, any]
   * )[]}
   */
  const plugins = [
    /*withFonts,
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
          adapter: require("responsive-loader/sharp"),
          sizes: [320, 640, 960, 1200, 1800, 2400],
          placeholder: true,
          placeholderSize: 50,
          optimizeImagesInDev: true,
        },
      },
    ],*/
    withBundleAnalyzer,
    // withCSS,
    [
      withMDX,
      {
        pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
      },
    ],
  ]

  return plugins.reduce((acc, next) => {
    if (Array.isArray(next)) {
      return next[0]({ ...acc, ...next[1] })
    }
    return next(acc)
  }, nextConfiguration)
}
