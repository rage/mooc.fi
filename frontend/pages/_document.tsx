import React from "react"

import Document, { Head, Html, Main, NextScript } from "next/document"

import theme from "../src/theme"

class MyDocument extends Document {
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
