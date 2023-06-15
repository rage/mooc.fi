// from https://github.com/garronej/tss-react/blob/main/src/next/pagesDir.tsx - a bit modified
import React from "react"

import type { NextComponentType } from "next"
// eslint-disable-next-line
import { type DocumentContext } from "next/document"
import parser from "ua-parser-js"

import createCache, {
  type EmotionCache,
  type Options as OptionsOfCreateCache,
} from "@emotion/cache"
import { CacheProvider as DefaultCacheProvider } from "@emotion/react"
import type CreateEmotionServerType from "@emotion/server/create-instance"

//import { ComponentsEnhancer } from "next/dist/shared/lib/utils"
// import createEmotionServer from "@emotion/server/create-instance"

/**
 * @see <https://docs.tss-react.dev/ssr/next>
 * This utility implements https://emotion.sh/docs/ssr#advanced-approach
 * */
export function createEmotionSsr(
  /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
  options: Omit<OptionsOfCreateCache, "insertionPoint"> & {
    prepend?: boolean
  },
  /** By default <CacheProvider /> from 'import { CacheProvider } from "@emotion/react"' */
  CacheProvider: (
    props: React.PropsWithChildren<{
      value: EmotionCache
    }>,
  ) => React.ReactNode | React.JSX.Element | null = DefaultCacheProvider,
) {
  const { prepend, ...optionsWithoutPrependProp } = options

  const appPropName = `${options.key}EmotionCache`
  const insertionPointId = `${options.key}-emotion-cache-insertion-point`

  function augmentDocumentWithEmotionCache(
    Document: NextComponentType<any, any, any>,
  ): void {
    let super_getInitialProps = Document.getInitialProps?.bind(Document)

    if (super_getInitialProps === undefined) {
      import("next/document").then(
        ({ default: DefaultDocument }) =>
          (super_getInitialProps =
            DefaultDocument.getInitialProps.bind(DefaultDocument)),
      )
    }

    let createEmotionServer: typeof CreateEmotionServerType | undefined =
      undefined

    import("@emotion/server/create-instance").then(
      (m) => (createEmotionServer = m.default),
    )
    ;(Document as any).getInitialProps = async (
      documentContext: DocumentContext,
    ) => {
      const cache = createCache(optionsWithoutPrependProp)
      const deviceType =
        parser(documentContext.req?.headers["user-agent"] ?? "").device.type ||
        "desktop"

      if (!createEmotionServer) {
        return
      }

      const emotionServer = createEmotionServer(cache)

      const originalRenderPage = documentContext.renderPage

      documentContext.renderPage = ({ enhanceApp, ...params }: any) =>
        originalRenderPage({
          ...params,
          enhanceApp: (App: any) => {
            const EnhancedApp = enhanceApp?.(App) ?? App

            return function EnhanceApp(props) {
              return (
                <EnhancedApp
                  {...{ ...props, deviceType, [appPropName]: cache }}
                />
              )
            }
          },
        })

      if (!super_getInitialProps) {
        return
      }
      const initialProps = await super_getInitialProps(documentContext)
      const { extractCriticalToChunks } = emotionServer

      const chunks = extractCriticalToChunks(initialProps.html)

      const emotionStyles = [
        <style id={insertionPointId} key={insertionPointId} />,
        ...chunks.styles
          .filter(({ css }) => css !== "")
          .map((style) => (
            <style
              data-emotion={`${style.key} ${style.ids.join(" ")}`}
              key={style.key}
              dangerouslySetInnerHTML={{ __html: style.css }}
            />
          )),
      ]

      const otherStyles = React.Children.toArray(initialProps.styles)

      return {
        ...initialProps,
        styles: prepend
          ? [...emotionStyles, ...otherStyles]
          : [...otherStyles, ...emotionStyles],
      }
    }
  }

  function withAppEmotionCache<
    AppComponent extends NextComponentType<any, any, any>,
  >(App: AppComponent): AppComponent {
    const createClientSideCache = (() => {
      let cache: EmotionCache | undefined = undefined

      return () => {
        if (cache !== undefined) {
          return cache
        }

        cache = createCache({
          ...optionsWithoutPrependProp,
          insertionPoint: (() => {
            // NOTE: Under normal circumstances we are on the client.
            // It might not be the case though, see: https://github.com/garronej/tss-react/issues/124
            const isBrowser =
              typeof document === "object" &&
              typeof document?.getElementById === "function"

            if (!isBrowser) {
              return undefined
            }

            const htmlElement = document.getElementById(insertionPointId)

            if (htmlElement === null) {
              return undefined
            }

            return htmlElement
          })(),
        })

        return cache
      }
    })()

    function AppWithEmotionCache(props: any) {
      const { [appPropName]: cache, ...rest } = props
      return (
        <CacheProvider value={cache ?? createClientSideCache()}>
          <App {...rest} />
        </CacheProvider>
      )
    }

    Object.keys(App).forEach(
      (staticMethod) =>
        ((AppWithEmotionCache as any)[staticMethod] = (App as any)[
          staticMethod
        ]),
    )

    AppWithEmotionCache.displayName = AppWithEmotionCache.name

    return AppWithEmotionCache as any
  }

  return { withAppEmotionCache, augmentDocumentWithEmotionCache }
}
