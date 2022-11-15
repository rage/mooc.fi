import React from "react"

import Document, { Head, Html, Main, NextScript } from "next/document"

//  DocumentContext,
//import createEmotionServer from "@emotion/server/create-instance"
//import { css } from "@emotion/react"
//import createEmotionCache from "../src/createEmotionCache"
import theme from "../src/theme"

//import { openSans, openSansCondensed } from "../src/fonts"

class MyDocument extends Document {
  /*static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage

    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />
          },
      })

    const initialProps = await Document.getInitialProps(ctx)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ))
    const fontVariables = (
      <style
        key="font-variables"
        dangerouslySetInnerHTML={{ __html: fontCss.styles.toString() }}
      />
    )
    return {
      ...initialProps,
      emotionStyleTags,
      fontVariables,
    }
  }*/

  render() {
    return (
      <Html lang="fi" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
          <meta name="emotion-insertion-point" content="" />
          {/*{(this.props as any).emotionStyleTags}
          {(this.props as any).fontVariables}*/}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
