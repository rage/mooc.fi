import { useCallback } from "react"

import nookies from "nookies"

import { useApolloClient } from "@apollo/client"
import { useEventCallback } from "@mui/material/utils"

import ProfileButton from "./ProfileButton"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"

const UserOptionsMenu = () => {
  const apollo = useApolloClient()
  const { loggedIn, logInOrOut } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  const onLogoutClick = useCallback(
    () => signOut(apollo, logInOrOut),
    [apollo, logInOrOut],
  )
  const onLoginClick = useEventCallback(() =>
    nookies.destroy(undefined, "redirect-back"),
  )

  if (loggedIn) {
    return (
      <>
        <ProfileButton />
        <HeaderMenuButton
          color="inherit"
          variant="text"
          onClick={onLogoutClick}
        >
          {t("logout")}
        </HeaderMenuButton>
      </>
    )
  }

  return (
    <>
      <HeaderMenuButton
        href="/_old/sign-in"
        color="inherit"
        variant="text"
        onClick={onLoginClick}
      >
        {t("loginShort")}
      </HeaderMenuButton>
      <HeaderMenuButton href="/_old/sign-up" color="inherit" variant="text">
        {t("signUp")}
      </HeaderMenuButton>
    </>
  )
}

export default UserOptionsMenu
