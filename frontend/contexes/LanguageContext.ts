import * as React from "react"

interface PageLanguageDetails {
  language: string
  url: string
}

const LanguageContext = React.createContext<PageLanguageDetails>({
  language: "fi",
  url: "",
})

export default LanguageContext
