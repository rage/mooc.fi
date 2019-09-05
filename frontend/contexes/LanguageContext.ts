import * as React from "react"

interface PageLanguageDetails {
  language: string
  url: string
  hrefUrl: string
}

const LanguageContext = React.createContext<PageLanguageDetails>({
  language: "fi",
  url: "",
  hrefUrl: "",
})

export default LanguageContext
