import Link from "next/link"
import nookies from "nookies"

import { useApolloClient } from "@apollo/client"

import ProfileButton from "./ProfileButton"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

interface Props {
  isSignedIn: boolean
  logInOrOut: any
}
const UserOptionsMenu = (props: Props) => {
  const client = useApolloClient()
  const { isSignedIn, logInOrOut } = props
  const t = useTranslator(CommonTranslations)

  if (isSignedIn) {
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
