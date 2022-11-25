import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import Link from "next/link"
import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import ChalkboardTeacher from "@fortawesome/fontawesome-free/svgs/solid/chalkboard-user.svg?icon"
import Dashboard from "@fortawesome/fontawesome-free/svgs/solid/gauge-high.svg?icon"
import List from "@fortawesome/fontawesome-free/svgs/solid/list.svg?icon"
import SignOut from "@fortawesome/fontawesome-free/svgs/solid/right-from-bracket.svg?icon"
import User from "@fortawesome/fontawesome-free/svgs/solid/user.svg?icon"
import MenuIcon from "@mui/icons-material/Menu"
import {
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"
import { SerializedStyles } from "@mui/styled-engine"

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
  @media (max-width: 599px) {
    display: none;
  }
`

const MobileMenuContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  @media (min-width: 600px) {
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

const iconStyle = css`
  height: 1rem;
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
        <Link href="/_new/profile" passHref>
          <MenuButton>{userDisplayName}</MenuButton>
        </Link>
        <Link href={pathname} passHref>
          <MenuButton onClick={onLogOut}>{t("logout")}</MenuButton>
        </Link>
      </>
    )
  }

  return (
    <>
      <Link href="/_new/sign-in" passHref>
        <MenuButton>{t("loginShort")}</MenuButton>
      </Link>
      <Link href="/_new/sign-up" prefetch={false} passHref>
        <MenuButton>{t("signUp")}</MenuButton>
      </Link>
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

interface MobileMenuItemProps {
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { css: SerializedStyles }
  >
  text: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLLIElement>
  [key: string]: any
}

const MobileMenuItem = forwardRef<HTMLLIElement, MobileMenuItemProps>(
  ({ Icon, text, href, onClick = () => void 0, ...props }, ref) => {
    const WrapLink: React.FunctionComponent<React.PropsWithChildren> = ({
      children,
    }) => {
      if (href) {
        return (
          <Link href={href} passHref {...props}>
            <MenuItem onClick={onClick} ref={ref}>
              {children}
            </MenuItem>
          </Link>
        )
      }
      return (
        <MenuItem onClick={onClick} ref={ref} {...props}>
          {children}
        </MenuItem>
      )
    }

    return (
      <WrapLink>
        <ListItemIcon>
          <Icon css={iconStyle} />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </WrapLink>
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
  const menuItems = useMemo(() => {
    const items = [
      <MenuItem key="mobile-menu-language-switch">
        <LanguageSwitch />
      </MenuItem>,
      <MobileMenuItem
        key="mobile-menu-courses"
        href="/_new/courses"
        Icon={ChalkboardTeacher}
        text={t("courses")}
        onClick={onClose}
      />,
      <MobileMenuItem
        key="mobile-menu-modules"
        href="/_new/study-modules"
        Icon={List}
        text={t("modules")}
        onClick={onClose}
      />,
      <Divider key="menu-divider-1" />,
    ]

    if (admin) {
      items.push(
        <MobileMenuItem
          key="mobile-menu-admin"
          href="/_new/admin"
          Icon={Dashboard}
          text="Admin"
          onClick={onClose}
        />,
        <Divider key="menu-divider-admin" />,
      )
    }
    if (loggedIn) {
      items.push(
        <MobileMenuItem
          key="mobile-menu-profile"
          href="/_new/profile"
          Icon={User}
          text={userDisplayName}
          onClick={onClose}
        />,
        <MobileMenuItem
          key="mobile-menu-logout"
          Icon={SignOut}
          text={t("logout")}
          onClick={() => signOut(client, logInOrOut)}
        />,
      )
    } else {
      items.push(
        <Link href="/_new/sign-in" passHref key="menu-login">
          <MenuItem onClick={onClose}>{t("loginShort")}</MenuItem>
        </Link>,
        <Link href="/_new/sign-up" prefetch={false} passHref key="menu-signup">
          <MenuItem onClick={onClose}>{t("signUp")}</MenuItem>
        </Link>,
      )
    }

    return items
  }, [loggedIn, admin])

  return (
    <MobileMenuContainer>
      <IconButton onClick={onClick} aria-hidden={true}>
        <MenuIcon />
      </IconButton>
      <Menu
        open={isOpen}
        keepMounted={false}
        onClose={onClose}
        anchorEl={anchor.current}
        ref={ref}
      >
        {menuItems}
      </Menu>
    </MobileMenuContainer>
  )
})

export { DesktopNavigationMenu, MobileNavigationMenu }
