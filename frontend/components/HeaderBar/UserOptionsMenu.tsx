import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"
import Link from "next/link"
import nookies from "nookies"

import { useApolloClient } from "@apollo/client"

import ProfileButton from "./ProfileButton"

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
