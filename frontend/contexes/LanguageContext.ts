import * as React from "react"

interface PageLanguageDetails {
  language: string
  url: string
  toggleLanguage: () => void
}

const LanguageContext = React.createContext<PageLanguageDetails>({
  language: "fi",
  url: "",
  toggleLanguage: () => {},
})

export default LanguageContext
