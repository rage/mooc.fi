// @ts-check
const path = require("path")
/*const dns = require("dns")

// fix for undici
dns.setDefaultResultOrder("ipv4first")*/

const isProduction = process.env.NODE_ENV === "production"

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
    statsOptions: {
      source: true,
    },
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
 * @param {string} _phase
 * @returns {NextConfig}
 */
const nextConfiguration = (_phase) => ({
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
  trailingSlash: true,
  i18n: {
    locales: ["en", "fi"],
    defaultLocale: "fi",
  },
  compiler: {
    emotion: {
      // would label things with [local] or something; will break styling if not set to never
      // autoLabel: "never",
      // autoLabel: "never",
      // labelFormat: "[dirname]--[filename]--[local]",
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
        "@mui/material": {
          styled: {
            canonicalImport: ["@emotion/styled", "default"],
            styledBaseImport: ["@mui/material", "styled"],
          },
        },
      },
    },
  },
  transpilePackages: ["@mui/system", "@mui/material", "@mui/icons-material"],
  modularizeImports: {
    "@mui/material/?(((\\w*)?/?)*)": {
      transform: {
        css: "/lib/reexports/css",
        "*": "@mui/material/{{ matches.[1] }}/{{member}}",
      },
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
    "@mui/icons-material/?(((\\w*)?/?)*)": {
      transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
    },
    "/graphql/generated": {
      transform: {
        "(.*)Document": "/graphql/generated/definitions/{{member}}",
        "*": "/graphql/generated/types",
      },
      skipDefaultConversion: true,
    },
  },
  /**
   *
   * @param {import("webpack").Configuration} config
   * @param {import("next/dist/server/config-shared").WebpackConfigContext} options
   * @returns {import("webpack").Configuration}
   */
  webpack: (config, options) => {
    /*config.module.rules.push({
      test: /\.svg$/, // (svg|png|jpeg|jpg|gif|webp)
      type: "asset",
    })*/
    /*config.module.rules.push({
      test: /\.(png|jpg|gif|webp)$/,
      exclude: ["/public/images/originals/", "/public/images/courseimages/"],
    })*/
    /**  */
    if (!config.module) {
      config.module = {}
    }
    if (!config.module.rules) {
      config.module.rules = []
    }
    const found =
      config.module.rules?.findIndex((rule) => {
        if (!isRuleSetRule(rule)) {
          return false
        }
        if (rule.test instanceof RegExp) {
          return rule.test?.exec?.("u.svg")
        }
        return false
      }) ?? -1

    let originalRule
    if (found >= 0) {
      const foundRule = config.module.rules[found]
      if (isRuleSetRule(foundRule)) {
        foundRule.test = /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp)$/i
        originalRule = foundRule
      }
    }
    // lacks the case that the rule is in oneOf
    // -- in this case we also need to check that the rule _doesn't_ have a resourceQuery

    config.module.rules?.push({
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
      config.module.rules?.push({
        ...originalRule,
        test: /\.svg$/,
        resourceQuery: { not: [/icon/] },
      })
    }
    config.module.rules?.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    })

    const alias = config.resolve?.alias
    if (!config.resolve) {
      config.resolve = {}
    }
    config.resolve.alias = {
      ...alias,
      "@mui/material/styled": path.resolve(
        __dirname,
        "node_modules/@mui/material/styles/styled.js",
      ),
      "@mui/material/styles/css": path.resolve(
        __dirname,
        "node_modules/@mui/styled-engine",
      ),
      "@mui/material/locale/fiFI/default": path.resolve(
        __dirname,
        "node_modules/@mui/material/locale",
      ),
      "react-dom$": "react-dom/profiling",
    }

    if (options.isServer && isProduction) {
      config.devtool = "source-map" // false
    }
    if (!isProduction) {
      config.devtool = "eval-source-map"
    }

    /*config.optimization = {
      ...config.optimization,
      minimize: false
    }*/

    return config
  },
  /*eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },*/
  experimental: {
    ...(!isProduction && { logging: "verbose" }),
    /*swcPlugins: [
      [
        "@graphql-codegen/client-preset-swc-plugin",
        { artifactDirectory: "./graphql/generated", gqlTagName: "gql" },
      ],
    ],*/
  },
  // swcMinify: false,
  // productionBrowserSourceMaps: true,
})

/**
 * @param {import("webpack").RuleSetRule | any} rule
 * @returns {rule is import("webpack").RuleSetRule}
 **/
const isRuleSetRule = (rule) => {
  return "test" in rule
}

/**
 * @param {string} phase
 * @returns {NextConfig}
 */
module.exports = (phase) => {
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
  }, nextConfiguration(phase))
}

/**
 * @typedef {import('next').NextConfig} NextConfig
 * @typedef {((config?: NextConfig) => NextConfig) | ((config: NextConfig) => NextConfig)} NextPlugin
 */
