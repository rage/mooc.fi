import { Fragment } from "react"
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document"
import flush from "styled-jsx/server"
import { ServerStyleSheets } from "@material-ui/styles"
import theme from "../src/theme"
import { ServerStyleSheet } from "styled-components"

import { fontCss } from "/src/fonts"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheets = new ServerStyleSheets()
    const sheet = new ServerStyleSheet()

    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => {
            const MuiStylesDataWrapper = sheets.collect(<App {...props} />)

            const styledComponentsDataWrapper = sheet.collectStyles(
              MuiStylesDataWrapper,
            )
            return styledComponentsDataWrapper
          },
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,

        // if we were to use GlobalStyles, we'd insert them here - or _app before <Head> ?
        styles: (
          <Fragment>
            {initialProps.styles}
            {sheets.getStyleElement()}
            {sheet.getStyleElement()}
            {flush() || null}
          </Fragment>
        ),
      }
    } finally {
      sheet.seal()
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
          <style dangerouslySetInnerHTML={{ __html: fontCss }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
