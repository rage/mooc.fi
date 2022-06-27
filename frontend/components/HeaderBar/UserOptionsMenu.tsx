import { useContext } from "react"

import { useApolloClient } from "@apollo/client"
import Link from "next/link"
import nookies from "nookies"

import ProfileButton from "./ProfileButton"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import LoginStateContext from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const UserOptionsMenu = () => {
  const client = useApolloClient()
  const t = useTranslator(CommonTranslations)
  const { currentUser, logInOrOut, loggedIn } = useContext(LoginStateContext)

  if (loggedIn) {
    return (
      <>
        <ProfileButton currentUser={currentUser} />
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
      <Link href={`/sign-in`} passHref>
        <HeaderMenuButton
          color="inherit"
          variant="text"
          onClick={() => nookies.destroy({}, "redirect-back")}
        >
          {t("loginShort")}
        </HeaderMenuButton>
      </Link>
      <Link href={`/sign-up`} prefetch={false} passHref>
        <HeaderMenuButton color="inherit" variant="text">
          {t("signUp")}
        </HeaderMenuButton>
      </Link>
    </>
  )
}

export default UserOptionsMenu
