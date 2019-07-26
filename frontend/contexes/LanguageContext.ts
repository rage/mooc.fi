import * as React from "react"

interface PageLanguageDetails {
  language: string | null
  languageSwitchLink: string
}

const LanguageContext = React.createContext<PageLanguageDetails>({
  language: null,
  languageSwitchLink: "",
})

export default LanguageContext
