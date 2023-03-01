import React, { useCallback, useMemo } from "react"

import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import SignOut from "@fortawesome/fontawesome-free/svgs/solid/right-from-bracket.svg?icon"
import User from "@fortawesome/fontawesome-free/svgs/solid/user.svg?icon"
import {
  Button,
  ButtonProps,
  EnhancedButton,
  SvgIconProps,
  useMediaQuery,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { NavigationLinks } from "./NavigationLinks"
import LanguageSwitch from "/components/NewLayout/Header/LanguageSwitch"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const NavigationMenuContainer = styled("nav")(
  ({ theme }) => `
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  ${theme.breakpoints.down("sm")} {
    display: none;
  }
`,
)

const NavigationRightContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-grow: 1;
  width: 100%;
`

const NavigationLinksWrapper = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-shrink: 1;
  
  ${theme.breakpoints.down("md")} {
    display: none;
  }
`,
)

const MenuButtonBase = styled(Button)`
  display: flex;
  max-height: 8vh;
  white-space: nowrap;
  font-size: 1rem;
  gap: 0.5rem;
  max-width: 240px;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: normal;
` as EnhancedButton<"button", MenuButtonProps>

interface MenuButtonProps {
  Icon?: React.FunctionComponent<SvgIconProps>
  narrow?: boolean
}

const MenuButton = React.memo(
  ({
    Icon,
    narrow,
    children,
    ...props
  }: React.PropsWithChildren<MenuButtonProps & ButtonProps>) => {
    return (
      <MenuButtonBase {...props}>
        {Icon && <Icon fontSize="small" />}
        {children}
      </MenuButtonBase>
    )
  },
)

const UserOptionsMenu = () => {
  const client = useApolloClient()
  const { pathname, locale } = useRouter()
  const { loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)
  const isNarrow = useMediaQuery("(max-width: 899px)", { noSsr: true })

  const userDisplayName = useMemo(() => {
    const name = currentUser?.full_name
    const initials = (
      (currentUser?.first_name?.[0] ?? "") + (currentUser?.last_name?.[0] ?? "")
    ).toLocaleUpperCase()

    if (!name) {
      return t("myProfile")
    }
    if (name.length > 20) {
      return initials
    }

    return name
  }, [currentUser, locale, t])

  const onLogOut = useCallback(
    () => signOut(client, logInOrOut),
    [client, logInOrOut],
  )

  if (loggedIn) {
    return (
      <>
        <MenuButton
          href="/_new/profile"
          Icon={User}
          narrow={isNarrow}
          title={t("myProfile")}
        >
          {isNarrow ? null : userDisplayName}
        </MenuButton>
        <MenuButton
          href={pathname}
          Icon={SignOut}
          onClick={onLogOut}
          title={t("logout")}
        />
      </>
    )
  }

  return (
    <>
      <MenuButton href="/_new/sign-in">{t("loginShort")}</MenuButton>
      <MenuButton href="/_new/sign-up" prefetch={false}>
        {t("signUp")}
      </MenuButton>
    </>
  )
}

const DesktopNavigationMenu = () => {
  return (
    <NavigationMenuContainer role="navigation" aria-label="main navigation">
      <NavigationLinksWrapper>
        <NavigationLinks />
      </NavigationLinksWrapper>
      <NavigationRightContainer>
        <LanguageSwitch />
        <UserOptionsMenu />
      </NavigationRightContainer>
    </NavigationMenuContainer>
  )
}

export default DesktopNavigationMenu
