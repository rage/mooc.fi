import * as React from "react"

interface PageLanguageDetails {
  language: string
  toggleLanguage: () => void
}

const LanguageContext = React.createContext<PageLanguageDetails>({
  language: "fi",
  toggleLanguage: () => {},
})

export default LanguageContext
