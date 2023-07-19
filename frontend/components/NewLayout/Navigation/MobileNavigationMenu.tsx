import React, {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useApolloClient } from "@apollo/client"
import ChalkboardTeacher from "@fortawesome/fontawesome-free/svgs/solid/chalkboard-user.svg?icon"
import Dashboard from "@fortawesome/fontawesome-free/svgs/solid/gauge-high.svg?icon"
import List from "@fortawesome/fontawesome-free/svgs/solid/list.svg?icon"
import SignOut from "@fortawesome/fontawesome-free/svgs/solid/right-from-bracket.svg?icon"
import SignIn from "@fortawesome/fontawesome-free/svgs/solid/right-to-bracket.svg?icon"
import Register from "@fortawesome/fontawesome-free/svgs/solid/user-plus.svg?icon"
import User from "@fortawesome/fontawesome-free/svgs/solid/user.svg?icon"
import MenuIcon from "@mui/icons-material/Menu"
import {
  Divider,
  EnhancedMenuItem,
  EnhancedMenuItemProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MUIMenuItem,
  SvgIcon,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import LanguageSwitch from "/components/NewLayout/Header/LanguageSwitch"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"

const MobileMenuContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  justify-content: flex-end;
  ${theme.breakpoints.up("sm")} {
    display: none;
  }
`,
)

interface MobileMenuItemProps {
  Icon: typeof SvgIcon
  text: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

const MenuItem = MUIMenuItem as EnhancedMenuItem<"a">

const MobileMenuItem = forwardRef<
  HTMLAnchorElement,
  EnhancedMenuItemProps<"a"> & MobileMenuItemProps
>(({ Icon, text, ...props }, ref) => {
  return (
    <MenuItem component="a" {...props} ref={ref}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  )
})

const MobileNavigationMenu = forwardRef<HTMLDivElement>(({}, ref) => {
  const [anchor, setAnchor] = useState<
    (EventTarget & HTMLAnchorElement) | null
  >(null)
  const open = Boolean(anchor)

  const t = useTranslator(CommonTranslations)
  const { admin, loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const apollo = useApolloClient()

  const onClick: MouseEventHandler<HTMLAnchorElement> = useEventCallback(
    (event) => {
      setAnchor(event.currentTarget)
    },
  )

  const onClose: MouseEventHandler<HTMLAnchorElement> = useEventCallback(() => {
    setAnchor(null)
  })

  useEffect(() => {
    const resizeListener = () => {
      setAnchor(null)
    }
    window?.addEventListener("resize", resizeListener)

    return () => window?.removeEventListener("resize", resizeListener)
  }, [])

  const onSignOut = useCallback(() => {
    setAnchor(null)
    signOut(apollo, logInOrOut)
  }, [apollo, signOut, logInOrOut])

  const userDisplayName = useMemo(() => {
    const name = currentUser?.full_name

    if (!name) {
      return t("myProfile")
    }

    return name
  }, [currentUser, t])

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
        <MobileMenuItem
          href="/_new/sign-in"
          key="menu-login"
          Icon={SignIn}
          onClick={onClose}
          text={t("loginShort")}
          title={t("loginShort")}
        >
          {t("loginShort")}
        </MobileMenuItem>,
        <MobileMenuItem
          href="/_new/sign-up"
          key="menu-signup"
          Icon={Register}
          onClick={onClose}
          text={t("signUp")}
          title={t("signUp")}
        >
          {t("signUp")}
        </MobileMenuItem>,
      )
    }

    return items
  }, [loggedIn, onClose, t, admin, MobileMenuItem])

  return (
    <MobileMenuContainer>
      <IconButton
        onClick={onClick as any as MouseEventHandler<HTMLButtonElement>}
        aria-hidden
      >
        <MenuIcon />
      </IconButton>
      <Menu open={open} onClose={onClose} anchorEl={anchor} ref={ref}>
        {menuItems}
      </Menu>
    </MobileMenuContainer>
  )
})

export default MobileNavigationMenu
