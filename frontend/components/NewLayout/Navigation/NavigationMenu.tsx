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
  ButtonProps,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
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
  width: 100%;
`

const NavigationLinksWrapper = styled("div")`
  display: flex;
  flex-shrink: 1;
  @media (max-width: 799px) {
    display: none;
  }
`

const MenuButtonBase = styled(Button)`
  display: flex;
  max-height: 10vh;
  white-space: nowrap;
  font-size: clamp(12px, 1.5vw, 16px);
  gap: 0.5rem;
  max-width: 240px;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: normal;
`

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
        <Link href="/_new/profile" passHref>
          <MenuButton Icon={User} narrow={isNarrow} title={t("myProfile")}>
            {isNarrow ? null : userDisplayName}
          </MenuButton>
        </Link>
        <Link href={pathname} passHref>
          <MenuButton Icon={SignOut} onClick={onLogOut} title={t("logout")} />
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
  Icon: typeof SvgIcon
  text: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLLIElement>
  [key: string]: any
}

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
        <Link href="/_new/sign-in" passHref key="menu-login">
          <MenuItem onClick={onClose} title={t("loginShort")}>
            {t("loginShort")}
          </MenuItem>
        </Link>,
        <Link href="/_new/sign-up" prefetch={false} passHref key="menu-signup">
          <MenuItem onClick={onClose} title={t("signUp")}>
            {t("signUp")}
          </MenuItem>
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
