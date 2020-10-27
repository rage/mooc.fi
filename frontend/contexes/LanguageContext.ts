import { createContext } from "react"

interface PageLanguageDetails {
  language: string
  url: string
  hrefUrl: string
}

const LanguageContext = createContext<PageLanguageDetails>({
  language: "fi",
  url: "",
  hrefUrl: "",
})

export default LanguageContext
