import React from "react"
import Language from "@material-ui/icons/Language"
import { Select, FormControl, MenuItem, InputLabel } from "@material-ui/core"
import Router from "next/router"
import NextI18Next from "../i18n"

function LanguageSwitch() {
  const currentLanguage = NextI18Next.i18n.language
  const [lang, setLang] = React.useState(currentLanguage)

  const SwitchLanguage = (event: React.ChangeEvent<{ value: unknown }>) => {
    const language = event.target.value || ""
    const path = Router.pathname
    document.cookie = `next-i18next=${event.target.value};path=/`
    Router.push({
      pathname: `/${language}${path}`,
    })
  }
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}
    >
      <Language style={{ marginRight: "1rem" }} />
      <form autoComplete="off">
        <FormControl style={{ minWidth: 120 }}>
          <Select value={lang} onChange={SwitchLanguage} name="language">
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fi">Suomi</MenuItem>
          </Select>
        </FormControl>
      </form>
    </div>
  )
}

export default LanguageSwitch
