import React, { useCallback, useMemo } from "react"

import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import SignOut from "@fortawesome/fontawesome-free/svgs/solid/right-from-bracket.svg?icon"
import User from "@fortawesome/fontawesome-free/svgs/solid/user.svg?icon"
import {
  Button,
  EnhancedButton,
  EnhancedButtonProps,
  SvgIconProps,
  useMediaQuery,
} from "@mui/material"
import { styled, Theme } from "@mui/material/styles"

import { NavigationLinks } from "./NavigationLinks"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"

const NavigationLinksContainer = styled("div")(
  ({ theme }) => `
  ${theme.breakpoints.down("sm")} {
    display: none;
  }
`,
)

const NavigationRightContainer = styled("div")`
  display: inline-grid;
  gap: 4px;
  grid-template-columns: repeat(3, auto);
  justify-content: flex-end;
`

interface MenuButtonProps {
  Icon?: React.FunctionComponent<SvgIconProps>
  narrow?: boolean
}

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
` as EnhancedButton

const MenuButton = React.memo(
  ({
    Icon,
    narrow,
    children,
    ...props
  }: React.PropsWithChildren<MenuButtonProps & EnhancedButtonProps>) => {
    return (
      <MenuButtonBase {...props}>
        {Icon && <Icon fontSize="small" />}
        {children}
      </MenuButtonBase>
    )
  },
)

const UserOptionsMenu = () => {
  const apollo = useApolloClient()
  const { pathname } = useRouter()
  const { loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)
  const isNarrow = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("desktop"),
  )

  const userDisplayName = useMemo(() => {
    if (isNarrow) {
      return null
    }
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
  }, [currentUser, t, isNarrow])

  const onLogOut = useCallback(
    () => signOut(apollo, logInOrOut),
    [apollo, logInOrOut],
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
          {userDisplayName}
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
    <>
      <NavigationLinksContainer>
        <NavigationLinks />
      </NavigationLinksContainer>
      <NavigationRightContainer>
        <UserOptionsMenu />
      </NavigationRightContainer>
    </>
  )
}

export default DesktopNavigationMenu
