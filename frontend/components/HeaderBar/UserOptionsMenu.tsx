import { useCallback } from "react"

import nookies from "nookies"

import { useApolloClient } from "@apollo/client"

import ProfileButton from "./ProfileButton"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"

const UserOptionsMenu = () => {
  const client = useApolloClient()
  const { loggedIn, logInOrOut } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  const onLogoutClick = useCallback(
    () => signOut(client, logInOrOut),
    [client, logInOrOut],
  )
  const onLoginClick = useCallback(
    () => nookies.destroy({}, "redirect-back"),
    [],
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
        href={`/sign-in`}
        color="inherit"
        variant="text"
        onClick={onLoginClick}
      >
        {t("loginShort")}
      </HeaderMenuButton>
      <HeaderMenuButton href={`/sign-up`} color="inherit" variant="text">
        {t("signUp")}
      </HeaderMenuButton>
    </>
  )
}

export default UserOptionsMenu
