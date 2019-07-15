import React from "react"
import PropTypes from "prop-types"
import Document, { Head, Main, NextScript } from "next/document"
import flush from "styled-jsx/server"
import { ServerStyleSheets } from "@material-ui/styles"
import theme from "../src/theme"
import { ServerStyleSheet } from "styled-components"

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheets = new ServerStyleSheets()
    const sheet = new ServerStyleSheet()

    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => {
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

      styles: (
        <React.Fragment>
          {sheets.getStyleElement()}
          {sheet.getStyleElement()}

          {flush() || null}
        </React.Fragment>
      ),
    }
  }

  render() {
    return (
      <html lang="fi" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default MyDocument
