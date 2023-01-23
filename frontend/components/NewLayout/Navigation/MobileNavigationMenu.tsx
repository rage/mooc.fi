import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import ChalkboardTeacher from "@fortawesome/fontawesome-free/svgs/solid/chalkboard-user.svg?icon"
import Dashboard from "@fortawesome/fontawesome-free/svgs/solid/gauge-high.svg?icon"
import List from "@fortawesome/fontawesome-free/svgs/solid/list.svg?icon"
import SignOut from "@fortawesome/fontawesome-free/svgs/solid/right-from-bracket.svg?icon"
import User from "@fortawesome/fontawesome-free/svgs/solid/user.svg?icon"
import MenuIcon from "@mui/icons-material/Menu"
import {
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import LanguageSwitch from "/components/NewLayout/Header/LanguageSwitch"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const MobileMenuContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  @media (min-width: 600px) {
    display: none;
  }
`

interface MobileMenuItemProps {
  Icon: typeof SvgIcon
  text: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLLIElement>
  [key: string]: any
}

// TODO: check if necessary and remove if it isn't
const MobileMenuItemLink = forwardRef<HTMLLIElement, MobileMenuItemProps>(
  (
    {
      href,
      children,
      onClick,
      ...props
    }: React.PropsWithChildren<MobileMenuItemProps>,
    ref,
  ) => {
    if (href) {
      return (
        <MenuItem href={href} onClick={onClick} ref={ref} {...props}>
          {children}
        </MenuItem>
      )
    }
    return (
      <MenuItem onClick={onClick} ref={ref} {...props}>
        {children}
      </MenuItem>
    )
  },
)

const MobileMenuItem = forwardRef<HTMLLIElement, MobileMenuItemProps>(
  ({ Icon, text, ...props }, ref) => {
    return (
      <MobileMenuItemLink ref={ref} {...props}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{text}</ListItemText>
      </MobileMenuItemLink>
    )
  },
)

const MobileNavigationMenu = forwardRef<HTMLDivElement>(({}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchor = useRef<(EventTarget & HTMLButtonElement) | null>(null)

  const t = useTranslator(CommonTranslations)
  const { admin, loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const client = useApolloClient()
  const { locale } = useRouter()

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

  const onSignOut = useCallback(() => {
    signOut(client, logInOrOut)
  }, [signOut, client, logInOrOut])

  const userDisplayName = useMemo(() => {
    const name = currentUser?.full_name

    if (!name) {
      return t("myProfile")
    }

    return name
  }, [currentUser, locale, t])

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
        title={t("courses")}
        onClick={onClose}
      />,
      <MobileMenuItem
        key="mobile-menu-modules"
        href="/_new/study-modules"
        Icon={List}
        text={t("modules")}
        title={t("modules")}
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
          title="Admin"
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
          title={t("myProfile")}
          onClick={onClose}
        />,
        <MobileMenuItem
          key="mobile-menu-logout"
          Icon={SignOut}
          text={t("logout")}
          title={t("logout")}
          onClick={onSignOut}
        />,
      )
    } else {
      items.push(
        <>
          <MenuItem
            href="/_new/sign-in"
            key="menu-login"
            onClick={onClose}
            title={t("loginShort")}
          >
            {t("loginShort")}
          </MenuItem>
          <MenuItem
            href="/_new/sign-up"
            key="menu-signup"
            onClick={onClose}
            title={t("signUp")}
          >
            {t("signUp")}
          </MenuItem>
        </>,
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

export default MobileNavigationMenu
