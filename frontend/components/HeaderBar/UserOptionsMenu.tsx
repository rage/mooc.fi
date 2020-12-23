import { signOut } from "/lib/authentication"
import { useApolloClient } from "@apollo/client"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import CommonTranslations from "/translations/common"
import LangLink from "/components/LangLink"
import nookies from "nookies"
import ProfileButton from "./ProfileButton"
import { HeaderMenuButton } from "/components/Buttons/HeaderMenuButton"
import { useTranslator } from "/translations"

interface Props {
  isSignedIn: boolean
  logInOrOut: any
}
const UserOptionsMenu = (props: Props) => {
  const client = useApolloClient()
  const { isSignedIn, logInOrOut } = props
  const { language } = useContext(LanguageContext)
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
      <LangLink href="/[lng]/sign-in" as={`/${language}/sign-in`} passHref>
        <HeaderMenuButton
          color="inherit"
          variant="text"
          onClick={() => nookies.destroy({}, "redirect-back")}
        >
          {t("loginShort")}
        </HeaderMenuButton>
      </LangLink>
      <LangLink
        href="/[lng]/sign-up"
        as={`/${language}/sign-up`}
        prefetch={false}
        passHref
      >
        <HeaderMenuButton color="inherit" variant="text">
          {t("signUp")}
        </HeaderMenuButton>
      </LangLink>
    </>
  )
}

export default UserOptionsMenu
