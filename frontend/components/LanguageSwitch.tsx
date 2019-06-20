import React from "react"
import Language from "@material-ui/icons/Language"
import {
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Button,
} from "@material-ui/core"
import Router from "next/router"
import NextI18Next from "../i18n"

function LanguageSwitch() {
  const currentLanguage = NextI18Next.i18n.language
  const [lang, setLang] = React.useState(currentLanguage)

  const SwitchLanguage = () => {
    let language
    {
      lang === "en" ? (language = "fi") : (language = "en")
    }
    const path = Router.pathname
    document.cookie = `next-i18next=${language};path=/`
    Router.push({
      pathname: `/${language}${path}`,
    })
  }
  return (
    <Button onClick={SwitchLanguage}>
      <Language style={{ marginRight: "1rem" }} />
      {lang === "en" ? "Suomenkielinen versio" : "English version"}
    </Button>
  )
}

/*form autoComplete="off">
        <FormControl style={{ minWidth: 120 }}>
          <Select value={lang} onChange={SwitchLanguage} name="language">
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="fi">Suomi</MenuItem>
          </Select>
        </FormControl>
      </form>*/

export default LanguageSwitch
