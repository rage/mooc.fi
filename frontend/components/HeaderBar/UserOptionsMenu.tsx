import nookies from "nookies"

import { useApolloClient } from "@apollo/client"

import ProfileButton from "./ProfileButton"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const UserOptionsMenu = () => {
  const client = useApolloClient()
  const { loggedIn, logInOrOut } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  if (loggedIn) {
    return (
      <>
        <ProfileButton />
        <HeaderMenuButton
          color="inherit"
          variant="text"
          onClick={() => signOut(client, logInOrOut)}
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
        onClick={() => nookies.destroy({}, "redirect-back")}
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
