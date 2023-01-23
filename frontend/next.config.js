// @ts-check
/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {((config?: NextConfig) => NextConfig) | ((config: NextConfig) => NextConfig)} NextPlugin
 */
/*const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})*/
/** @type {NextPlugin} */
let withStatoscope

if (process.env.ANALYZE === "true") {
  withStatoscope = require("next-statoscope")({
    enabled: true,
    saveOnlyStats: false,
    watchMode: false,
    additionalStats: [],
    open: "file",
    compressor: "gzip",
    extensions: [],
  })
}
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
    "@fortawesome/free-brands-svg-icons": {
      transform: "@fortawesome/free-brands-svg-icons/{{member}}",
    },
    "@fortawesome/free-solid-svg-icons": {
      transform: "@fortawesome/free-solid-svg-icons/{{member}}",
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

    /*config.module.rules.push({
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
    })*/

    return config
  },
  // swcMinify: false
}

module.exports = () => {
  /**
   * @type {Array<(
   *  NextPlugin |
   *   [NextPlugin, NextConfig]
   * )>}
   */
  const plugins = []

  if (withStatoscope) {
    plugins.push(withStatoscope)
  }
  plugins.push([
    withMDX,
    { pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"] },
  ])

  return plugins.reduce((acc, next) => {
    if (Array.isArray(next)) {
      return next[0]({ ...acc, ...next[1] })
    }
    return next(acc)
  }, nextConfiguration)
}
