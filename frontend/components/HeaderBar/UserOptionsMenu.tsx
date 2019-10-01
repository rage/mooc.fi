import * as React from "react"
import { signOut } from "/lib/authentication"
import { useApolloClient } from "@apollo/react-hooks"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import getCommonTranslator from "/translations/common"
import LangLink from "/components/LangLink"
import nookies from "nookies"

const StyledButton = styled(Button)`
  margin: 1rem;
  font-size: 18px;
`

interface Props {
  isSignedIn: boolean
  logInOrOut: any
}
const UserOptionsMenu = (props: Props) => {
  const client = useApolloClient()
  const { isSignedIn, logInOrOut } = props
  const { language } = useContext(LanguageContext)
  const t = getCommonTranslator(language)

  if (isSignedIn) {
    return (
      <>
        <StyledButton
          color="inherit"
          variant="text"
          onClick={() => signOut(client).then(logInOrOut)}
        >
          {t("logout")}
        </StyledButton>
      </>
    )
  }
  return (
    <>
      <LangLink href="/[lng]/sign-in" as={`/${language}/sign-in`} passHref>
        <StyledButton
          color="inherit"
          variant="text"
          onClick={() => nookies.destroy({}, "redirect-back")}
        >
          {t("loginShort")}
        </StyledButton>
      </LangLink>
      <LangLink
        href="/[lng]/sign-up"
        as={`/${language}/sign-up`}
        prefetch={false}
        passHref
      >
        <StyledButton color="inherit" variant="text">
          {t("signUp")}
        </StyledButton>
      </LangLink>
    </>
  )
}

export default UserOptionsMenu
