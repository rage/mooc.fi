import styled from "@emotion/styled"
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  useScrollTrigger,
} from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import MoocLogo from "/components/HeaderBar/MoocLogo"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"
import MenuIcon from "@mui/icons-material/Menu"
import { useState, useEffect } from "react"
import LanguageIcon from "@mui/icons-material/Language"
import { useApolloClient } from "@apollo/client"
import { signOut } from "/lib/authentication"

interface HideOnScrollProps {
  window?: () => Window
  children: React.ReactElement
}

function HideOnScroll({ window, children }: HideOnScrollProps) {
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const StyledToolbar = styled(Toolbar)`
  display: flex;
  flex-direction: row;
`

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`

function useActiveTab() {
  const { pathname } = useRouter()

  return pathname.match(
    "/(courses|study-modules|email-templates|profile|users|admin)",
  )?.[1]
}

const NavigationMenuContainer = styled.nav`
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

const MobileMenuContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  @media (min-width: 400px) {
    display: none;
  }
`

const NavigationLink = styled.a<{ active: boolean }>`
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "inherit")};

  &:hover {
    font-weight: 600;
  }
  transition: 0.1s;
`

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

      <LanguageSwitch />
      <UserOptionsMenu />
    </NavigationMenuContainer>
  )
}

const MobileNavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchor, setAnchor] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null)
  const t = useTranslator(CommonTranslations)
  const { admin, loggedIn, logInOrOut, currentUser } = useLoginStateContext()
  const client = useApolloClient()

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen((value) => !value)
    setAnchor(event.currentTarget)
  }

  const onClose = () => {
    setIsOpen(false)
    setAnchor(null)
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
        anchorEl={anchor}
      >
        <MenuItem>
          <LanguageSwitch />
        </MenuItem>
        <Link href="/_new/courses" passHref>
          <MenuItem onClick={onClose}>{t("courses")}</MenuItem>
        </Link>
        <Link href="/_new/study-modules" passHref>
          <MenuItem onClick={onClose}>{t("modules")}</MenuItem>
        </Link>

        <Divider />

        {admin && (
          <>
            <Link href="/_new/admin" passHref>
              <MenuItem onClick={onClose}>Admin</MenuItem>
            </Link>
            <Divider />
          </>
        )}

        {loggedIn ? (
          <>
            <Link href="/_new/profile" passHref>
              <MenuItem onClick={onClose}>{userDisplayName}</MenuItem>
            </Link>
            <MenuItem onClick={() => signOut(client, logInOrOut)}>
              {t("logout")}
            </MenuItem>
          </>
        ) : (
          <>
            <Link href="/_new/sign-in" passHref>
              <MenuItem onClick={onClose}>{t("loginShort")}</MenuItem>
            </Link>
            <Link href="/_new/sign-up" prefetch={false} passHref>
              <MenuItem onClick={onClose}>{t("signUp")}</MenuItem>
            </Link>
          </>
        )}
      </Menu>
    </MobileMenuContainer>
  )
}

const LanguageSwitchContainer = styled((props: any) => (
  <Button component="div" disableRipple={true} {...props} />
))`
  gap: 0.5rem;
`

const Language = styled.a<{ active: boolean }>`
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "300")};
`

const locales = ["en", "fi"]

const LanguageSwitch = () => {
  const { locale: currentLocale, asPath } = useRouter()

  return (
    <LanguageSwitchContainer>
      <LanguageIcon />
      {locales.map((locale) => (
        <Link href={asPath} locale={locale} passHref>
          <Language active={currentLocale === locale}>{locale}</Language>
        </Link>
      ))}
    </LanguageSwitchContainer>
  )
}

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
function Header() {
  const { loggedIn } = useLoginStateContext()

  return (
    <>
      <HideOnScroll>
        <AppBar color="inherit" position="sticky" aria-label="user toobar">
          <StyledToolbar>
            <MoocLogo />
            <MenuContainer>
              <DesktopNavigationMenu />
              <MobileNavigationMenu />
            </MenuContainer>
          </StyledToolbar>
        </AppBar>
      </HideOnScroll>
    </>
  )
}

export default Header
