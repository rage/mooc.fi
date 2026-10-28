// Fails the build if a page would render on the server per request: that
// blocks responses, so every page must be static or generated at build time.
const pagesManifest = require("../.next/server/pages-manifest.json")
const prerenderManifest = require("../.next/prerender-manifest.json")
const { PHASE_PRODUCTION_BUILD } = require("next/constants")
const { i18n } = require("../next.config")(PHASE_PRODUCTION_BUILD)

const nextInternals = new Set(["/_app", "/_document", "/_error"])
const localePrefix = new RegExp(`^/(${(i18n?.locales ?? []).join("|")})(?=/|$)`)

const buildTimeRoutes = new Set([
  ...Object.keys(prerenderManifest.dynamicRoutes),
  ...Object.entries(prerenderManifest.routes).map(
    ([route, { srcRoute }]) =>
      srcRoute ?? (route.replace(localePrefix, "") || "/"),
  ),
])

const serverRendered = Object.entries(pagesManifest)
  .filter(([, file]) => file.endsWith(".js"))
  .map(([route]) => route)
  .filter((route) => !nextInternals.has(route) && !buildTimeRoutes.has(route))

if (serverRendered.length > 0) {
  console.error(
    `These pages render on the server per request:\n  ${serverRendered.join(
      "\n  ",
    )}\nRender them in the browser or generate them at build time.`,
  )
  process.exit(1)
}
