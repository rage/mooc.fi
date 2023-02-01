import React from "react"

import Document, { Head, Html, Main, NextScript } from "next/document"

//  DocumentContext,
//import createEmotionServer from "@emotion/server/create-instance"
//import { css } from "@emotion/react"
//import createEmotionCache from "../src/createEmotionCache"
import theme from "../src/theme"
import { augmentDocumentWithEmotionCache } from "./_app"

class CustomDocument extends Document {
  render() {
    return (
      <Html dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
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

augmentDocumentWithEmotionCache(CustomDocument)

export default CustomDocument
