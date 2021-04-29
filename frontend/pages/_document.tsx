import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheets } from "@material-ui/core/styles"
import theme from "/src/theme"
import { cache } from "./_app"
import createEmotionServer from "@emotion/server/create-instance"
import { ServerStyleSheets } from "@mui/styles"

import createEmotionCache from "../src/createEmotionCache"
import theme from "../src/theme"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets()

    const originalRenderPage = ctx.renderPage

    const cache = createEmotionCache()
    const { extractCriticalToChunks } = createEmotionServer(cache)

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) =>
          function EnhanceApp(props) {
            return sheets.collect(<App emotionCache={cache} {...props} />)
          },
      })

    const initialProps = await Document.getInitialProps(ctx)
    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion-css={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ))

    return {
      ...initialProps,

      // if we were to use GlobalStyles, we'd insert them here - or _app before <Head> ?
      styles: [
        ...emotionStyleTags,
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    }
  }

  render() {
    return (
      <Html lang="fi" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
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
