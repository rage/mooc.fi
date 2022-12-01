const withPlugins = require("next-compose-plugins")
const withFonts = require("next-fonts")
const withOptimizedImages = require("next-optimized-images")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
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
  compiler: {
    // enabling emotion here will allow for components to be used as selectors
    // ie. assuming there's a Card component we can do styled.div`${Card} + ${Card} { padding-top: 0.5rem; }`
    emotion: {
      // would label things with [local] or something; will break styling if not set to never
      autoLabel: "dev-only",
      labelFormat: "[dirname]-[filename]-[local]",
      importMap: {
        "@mui/system": {
          styled: {
            canonicalImport: ["@emotion/styled", "default"],
            styledBaseImport: ["@mui/system", "styled"],
          },
        },
        "@mui/material/styles": {
          styled: {
            canonicalImport: ["@emotion/styled", "default"],
            styledBaseImport: ["@mui/material/styles", "styled"],
          },
        },
      },
    },
  },
  experimental: {
    modularizeImports: {
      "@mui/icons-material": {
        transform: "@mui/icons-material/{{member}}",
      },
      "@mui/material": {
        transform: "@mui/material/{{member}}",
      },
      lodash: {
        transform: "lodash/{{member}}",
      },
      "@fortawesome/free-brands-svg-icons": {
        transform: "@fortawesome/free-brands-svg-icons/{{member}}",
      },
      "@fortawesome/free-solid-svg-icons": {
        transform: "@fortawesome/free-solid-svg-icons/{{member}}",
      },
    },
  },
  webpack: (config) => {
    const found = config.module.rules?.findIndex((rule) =>
      rule.test?.exec("u.svg"),
    )
    // remove the original svg rule but store the one variation with no resourcequery to load svg files
    let originalRule
    if (config.module.rules?.[found]) {
      config.module.rules[found].test = /\.(jpe?g|png|gif)$/i
      originalRule = config.module.rules[found].oneOf.find(
        (rule) => !rule.resourceQuery,
      )
    }

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      resourceQuery: /icon/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            memo: true,
            template: require("./src/iconTemplate"),
          },
        },
      ],
    })
    if (originalRule) {
      // insert it back
      config.module.rules.push({
        ...originalRule,
        test: /\.svg$/,
        resourceQuery: { not: [/icon/] },
      })
    }

    return config
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
          adapter: require("responsive-loader/sharp"),
          sizes: [320, 640, 960, 1200, 1800, 2400],
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
