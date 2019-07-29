import * as React from "react"

interface PageLanguageDetails {
  language: string | null
  url: string
}

const LanguageContext = React.createContext<PageLanguageDetails>({
  language: null,
  url: "",
})

export default LanguageContext
