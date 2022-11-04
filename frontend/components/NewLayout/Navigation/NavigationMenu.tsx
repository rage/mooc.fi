import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import type { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faChalkboardTeacher,
  faDashboard,
  faList,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import MenuIcon from "@mui/icons-material/Menu"
import {
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { NavigationLinks } from "./NavigationLinks"
import LanguageSwitch from "/components/NewLayout/Header/LanguageSwitch"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const NavigationMenuContainer = styled("nav")`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  @media (max-width: 399px) {
    display: none;
  }
`

const MobileMenuContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  @media (min-width: 400px) {
    display: none;
  }
`

const NavigationRightContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-grow: 1;
`

const NavigationLinksWrapper = styled("div")`
  display: flex;
  flex-grow: 1;
  @media (max-width: 599px) {
    display: none;
  }
`

const MenuButton = styled(Button)`
  display: flex;
  max-height: 10vh;
  white-space: nowrap;
  font-size: clamp(12px, 1.5vw, 16px);
`

const UserOptionsMenu = () => {
  const client = useApolloClient()
  const { pathname } = useRouter()
  const { loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  const userDisplayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : t("myProfile")

  const onLogOut = useCallback(
    () => signOut(client, logInOrOut),
    [client, logInOrOut],
  )

  if (loggedIn) {
    return (
      <>
        <MenuButton href="/_new/profile">{userDisplayName}</MenuButton>
        <MenuButton href={pathname} onClick={onLogOut}>
          {t("logout")}
        </MenuButton>
      </>
    )
  }
  return (
    <>
      <MenuButton href="/_new/sign-in">{t("loginShort")}</MenuButton>
      <MenuButton href="/_new/sign-up">{t("signUp")}</MenuButton>
    </>
  )
}

const DesktopNavigationMenu = () => {
  return (
    <NavigationMenuContainer role="navigation">
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

interface MobileMenuItemProps extends MenuItemProps {
  icon: IconProp
  text: string
  onClick?: React.MouseEventHandler<HTMLLIElement>
}

const MobileMenuItem = forwardRef<HTMLLIElement, MobileMenuItemProps>(
  ({ icon, text, onClick = () => void 0, ...props }, ref) => {
    return (
      <MenuItem onClick={onClick} ref={ref} {...props}>
        <ListItemIcon>
          <FontAwesomeIcon icon={icon} />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    )
  },
)

const MobileNavigationMenu = forwardRef<HTMLDivElement>(({}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchor = useRef<(EventTarget & HTMLButtonElement) | null>(null)

  const t = useTranslator(CommonTranslations)
  const { admin, loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const client = useApolloClient()

  const onClick: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    setIsOpen((value) => !value)
    anchor.current = event.currentTarget
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
    anchor.current = null
  }, [])

  useEffect(() => {
    const resizeListener = () => {
      setIsOpen(false)
    }
    window?.addEventListener("resize", resizeListener)

    return () => window?.removeEventListener("resize", resizeListener)
  }, [])

  const userDisplayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : t("myProfile")

  return (
    <MobileMenuContainer>
      <IconButton onClick={onClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        open={isOpen}
        keepMounted={false}
        onClose={onClose}
        anchorEl={anchor.current}
        ref={ref}
      >
        <MenuItem key="mobile-menu-language-switch">
          <LanguageSwitch />
        </MenuItem>
        <MobileMenuItem
          key="mobile-menu-courses"
          href="/_new/courses"
          icon={faChalkboardTeacher}
          text={t("courses")}
          onClick={onClose}
        />
        <MobileMenuItem
          key="mobile-menu-modules"
          href="/_new/study-modules"
          icon={faList}
          text={t("modules")}
          onClick={onClose}
        />
        <Divider key="menu-divider-1" />
        {admin && [
          <MobileMenuItem
            key="mobile-menu-admin"
            href="/_new/admin"
            icon={faDashboard}
            text="Admin"
            onClick={onClose}
          />,
          <Divider key="menu-divider-admin" />,
        ]}
        {loggedIn
          ? [
              <MobileMenuItem
                key="mobile-menu-profile"
                href="/_new/profile"
                icon={faUser}
                text={userDisplayName}
                onClick={onClose}
              />,
              <MobileMenuItem
                key="mobile-menu-logout"
                icon={faSignOut}
                text={t("logout")}
                onClick={() => signOut(client, logInOrOut)}
              />,
            ]
          : [
              <MenuItem href="/_new/sign-in" key="menu-login" onClick={onClose}>
                {t("loginShort")}
              </MenuItem>,
              <MenuItem
                href="/_new/sign-up"
                prefetch={false}
                key="menu-signup"
                onClick={onClose}
              >
                {t("signUp")}
              </MenuItem>,
            ]}
      </Menu>
    </MobileMenuContainer>
  )
})

export { DesktopNavigationMenu, MobileNavigationMenu }
