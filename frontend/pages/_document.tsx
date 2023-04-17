import React from "react"

import Document, { Head, Html, Main, NextScript } from "next/document"

import { augmentDocumentWithEmotionCache } from "./_app"
import newTheme, {
  fontVariableClass as newFontVariableClass,
} from "/src/newTheme"
import originalTheme, {
  fontVariableClass as originalFontVariableClass,
} from "/src/theme"

class CustomDocument extends Document {
  render() {
    const isNew = this.props.__NEXT_DATA__.page.includes("_new")
    const theme = isNew ? newTheme : originalTheme
    const fontVariableClass = isNew
      ? newFontVariableClass
      : originalFontVariableClass

    return (
      <Html
        lang={this.props.locale ?? "fi"}
        dir="ltr"
        className={fontVariableClass}
      >
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
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
