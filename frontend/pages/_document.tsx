import React from "react"

import { DocumentProps, Head, Html, Main, NextScript } from "next/document"

import { augmentDocumentWithEmotionCache } from "./_app"
import newTheme, {
  fontVariableClass as newFontVariableClass,
} from "/src/newTheme"
import originalTheme, {
  fontVariableClass as originalFontVariableClass,
} from "/src/theme"

interface CustomDocumentProps extends DocumentProps {
  apolloState: any
}

function CustomDocument(props: CustomDocumentProps) {
  props.__NEXT_DATA__.props.apolloState = props.apolloState
  const isOld = props.__NEXT_DATA__.page.includes("_old")

  const theme = isOld ? originalTheme : newTheme
  const fontVariableClass = isOld
    ? originalFontVariableClass
    : newFontVariableClass

  return (
    <Html lang={props.locale ?? "fi"} dir="ltr" className={fontVariableClass}>
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

augmentDocumentWithEmotionCache(CustomDocument)

export default CustomDocument
