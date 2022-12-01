import { NextComponentType } from "next"

import createCache, { EmotionCache } from "@emotion/cache"
import { CacheProvider } from "@emotion/react"

// from https://github.com/garronej/tss-react/blob/main/src/next.tsx
export function withEmotionCache<
  AppComponent extends NextComponentType<any, any, any>,
>(App: AppComponent): AppComponent {
  const createClientSideCache = (() => {
    let cache: EmotionCache | undefined = undefined

    return () => {
      if (cache !== undefined) {
        return cache
      }

      cache = createCache({
        key: "mui-style",
        insertionPoint: (() => {
          const isBrowser =
            typeof document === "object" &&
            typeof document?.getElementById === "function"

          if (!isBrowser) {
            return undefined
          }

          const htmlElement = document.getElementById(
            'meta[name="moocfi-emotion-cache-insertion-point"]',
          )

          if (!htmlElement) {
            return undefined
          }

          return htmlElement
        })(),
      })

      return cache
    }
  })()

  function AppWithEmotionCache(props: any) {
    const { emotionCache: cache, ...rest } = props

    return (
      <CacheProvider value={cache ?? createClientSideCache()}>
        <App {...rest} />
      </CacheProvider>
    )
  }

  Object.keys(App).forEach(
    (staticMethod) =>
      ((AppWithEmotionCache as any)[staticMethod] = (App as any)[staticMethod]),
  )

  AppWithEmotionCache.displayName = AppWithEmotionCache.name

  return AppWithEmotionCache as any
}
