import React from "react"
import Language from "@material-ui/icons/Language"
import { Select, FormControl, Input } from "@material-ui/core"
import Router from "next/router"

function LanguageSwitch() {
  const SwitchLanguage = (event: React.ChangeEvent<{ value: unknown }>) => {
    const language = event.target.value || ""
    document.cookie = `next-i18next=${event.target.value};path=/`
    Router.push({
      pathname: `/${language}`,
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Language style={{ marginRight: "1rem" }} />
      <form>
        <FormControl>
          <Select
            native
            value={"lang"}
            onChange={SwitchLanguage}
            input={<Input id="language-native-simple" />}
          >
            <option value="" />
            <option value="en">English</option>
            <option value="fi">Suomi</option>
          </Select>
        </FormControl>
      </form>
    </div>
  )
}

export default LanguageSwitch
