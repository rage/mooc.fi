import React, {
  forwardRef,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react"

import Link from "next/link"
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
} from "@mui/material"
import { styled } from "@mui/material/styles"

import LanguageSwitch from "/components/NewLayout/Header/LanguageSwitch"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

function useActiveTab() {
  const { pathname } = useRouter()

  return pathname.match(
    "/(courses|study-modules|email-templates|profile|users|admin)",
  )?.[1]
}

const NavigationMenuContainer = styled("nav")`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
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

const NavigationLink = styled("a")<{ active: boolean }>`
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "inherit")};

  &:hover {
    font-weight: 600;
  }
  transition: 0.1s;
`

const NavigationRightContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`

const UserOptionsMenu = () => {
  const client = useApolloClient()
  const { pathname } = useRouter()
  const { loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  const userDisplayName = currentUser?.first_name
    ? `${currentUser.first_name} ${currentUser.last_name}`
    : t("myProfile")

  if (loggedIn) {
    return (
      <>
        <Link href="/_new/profile" passHref>
          <Button>{userDisplayName}</Button>
        </Link>
        <Link href={pathname} passHref>
          <Button onClick={() => signOut(client, logInOrOut)}>
            {t("logout")}
          </Button>
        </Link>
      </>
    )
  }
  return (
    <>
      <Link href="/_new/sign-in" passHref>
        <Button>{t("loginShort")}</Button>
      </Link>
      <Link href="/_new/sign-up" prefetch={false} passHref>
        <Button>{t("signUp")}</Button>
      </Link>
    </>
  )
}

const DesktopNavigationMenu = () => {
  const { admin } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  const active = useActiveTab()

  return (
    <NavigationMenuContainer role="navigation">
      <Link href="/_new/courses" passHref>
        <NavigationLink active={active === "courses"}>
          {t("courses")}
        </NavigationLink>
      </Link>

      <Link href="/_new/study-modules" passHref>
        <NavigationLink active={active === "study-modules"}>
          {t("modules")}
        </NavigationLink>
      </Link>

      {admin && (
        <Link href="/_new/admin" passHref prefetch={false}>
          <NavigationLink active={active === "study-modules"}>
            Admin
          </NavigationLink>
        </Link>
      )}

      <NavigationRightContainer>
        <LanguageSwitch />
        <UserOptionsMenu />
      </NavigationRightContainer>
    </NavigationMenuContainer>
  )
}

interface MobileMenuItemProps {
  icon: IconProp
  text: string
  href?: string
  onClick?: React.MouseEventHandler<HTMLLIElement>
  [key: string]: any
}

const MobileMenuItem = forwardRef<HTMLLIElement, MobileMenuItemProps>(
  ({ icon, text, href, onClick = () => void 0, ...props }, ref) => {
    const WrapLink: React.FunctionComponent<React.PropsWithChildren<{}>> = ({
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
          <FontAwesomeIcon icon={icon} />
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

  const onClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsOpen((value) => !value)
    anchor.current = event.currentTarget
  }

  const onClose = () => {
    setIsOpen(false)
    anchor.current = null
  }

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

  // add to menu: profile, sign out / sign in, sign up
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
              <Link href="/_new/sign-in" passHref key="menu-login">
                <MenuItem onClick={onClose}>{t("loginShort")}</MenuItem>
              </Link>,
              <Link
                href="/_new/sign-up"
                prefetch={false}
                passHref
                key="menu-signup"
              >
                <MenuItem onClick={onClose}>{t("signUp")}</MenuItem>
              </Link>,
            ]}
      </Menu>
    </MobileMenuContainer>
  )
})

export { DesktopNavigationMenu, MobileNavigationMenu }
