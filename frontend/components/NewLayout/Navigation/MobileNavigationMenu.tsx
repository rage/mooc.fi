import React, { useState } from "react"

import { useRouter } from "next/router"

/*import { useApolloClient } from "@apollo/client"
import ChalkboardTeacher from "@fortawesome/fontawesome-free/svgs/solid/chalkboard-user.svg?icon"
import Dashboard from "@fortawesome/fontawesome-free/svgs/solid/gauge-high.svg?icon"
import ListIcon from "@fortawesome/fontawesome-free/svgs/solid/list.svg?icon"
import SignOut from "@fortawesome/fontawesome-free/svgs/solid/right-from-bracket.svg?icon"
import SignIn from "@fortawesome/fontawesome-free/svgs/solid/right-to-bracket.svg?icon"
import Register from "@fortawesome/fontawesome-free/svgs/solid/user-plus.svg?icon"
import User from "@fortawesome/fontawesome-free/svgs/solid/user.svg?icon"*/
import {
  Button,
  Collapse,
  Drawer,
  EnhancedListItemButton,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import CaretDownIcon from "../Icons/CaretDown"
import CaretUpIcon from "../Icons/CaretUp"
import HamburgerIcon from "../Icons/Hamburger"
import RemoveIcon from "../Icons/Remove"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
// import { signOut } from "/lib/authentication"
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

const MobileMenu = styled(Drawer)(
  ({ theme }) => `
  .MuiDrawer-paper {
    display: block;
    width: 90%;

    ${theme.breakpoints.up("xs")} {
      width: 400px;
    }
  }
`,
) as typeof Drawer

const MobileMenuHeader = styled("section")`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 12px 80px 12px 16px;
  gap: 16px;
  min-height: 68px;
  align-items: center;
`

const MobileMenuList = styled(List)`
  position: relative;
` as typeof List

const MobileMenuListItem = styled(ListItem)(
  ({ theme }) => `
  margin: 0 0 4px;
  display: flex;
  padding: 0;

  .MuiListItemText-primary {
    font-size: 1.3125rem;
    line-height: 28px;
    font-weight: 700;
    color: ${theme.palette.common.brand.light};
    letter-spacing: -0.42px;
    padding: 16px 0 16px 16px;
  }

  &.Mui-selected {
    background-color: transparent;
    .MuiListItemText-primary {
      color: ${theme.palette.common.grayscale.dark};
    }
  }
`,
)

const MobileMenuListItemText = styled(ListItemText)(
  ({ theme }) => `
  /*.MuiListItemText-primary {
    font-size: 1.3125rem;
    font-weight: 700;
    color: ${theme.palette.common.brand.light};
    letter-spacing: -0.42px;
    padding: 16px 0 16px 16px;
  }*/
`,
) as typeof ListItemText

const MobileMenuListItemButton = styled(ListItemButton)`
  &:hover {
    background: transparent;
  }
` as EnhancedListItemButton

const MobileMenuListItemIcon = styled(ListItemIcon)`
  /* */
`

interface MobileMenuItemProps {
  Icon?: typeof SvgIcon
  href?: string
  text: string
  collapsable?: boolean
}

const MobileMenuItem = ({
  Icon,
  href,
  text,
  collapsable,
  children,
}: React.PropsWithChildren<MobileMenuItemProps>) => {
  const { pathname } = useRouter()
  const [open, setOpen] = useState(false)

  const onClick = useEventCallback(() => {
    if (collapsable) {
      setOpen((prevOpen) => !prevOpen)
    }
  })

  return (
    <MobileMenuListItem selected={pathname === href}>
      <MobileMenuListItemButton variant="text" href={href} onClick={onClick}>
        {Icon && (
          <MobileMenuListItemIcon>
            <Icon />
          </MobileMenuListItemIcon>
        )}
        <MobileMenuListItemText primary={text} />
        {collapsable && (open ? <CaretUpIcon /> : <CaretDownIcon />)}
      </MobileMenuListItemButton>
      {collapsable && <Collapse in={open}>{children}</Collapse>}
    </MobileMenuListItem>
  )
}

// const MobileNavigationMenu = forwardRef<HTMLDivElement>(({}, ref) => {
const MobileNavigationMenu = () => {
  const [open, setOpen] = useState(false)

  const t = useTranslator(CommonTranslations)
  const { admin /*loggedIn, logInOrOut, currentUser*/ } = useLoginStateContext()
  //const apollo = useApolloClient()

  const onClick = useEventCallback(() => {
    setOpen((prevOpen) => !prevOpen)
  })

  const onClose = useEventCallback(() => {
    setOpen(false)
  })

  /*const onSignOut = useCallback(() => {
    setOpen(false)
    signOut(apollo, logInOrOut)
  }, [apollo, signOut, logInOrOut])

  const userDisplayName = useMemo(() => {
    const name = currentUser?.full_name

    if (!name) {
      return t("myProfile")
    }

    return name
  }, [currentUser, t])*/

  /*const menuItems = useMemo(() => {
    const items = [
      <MobileMenuItemOld
        key="mobile-menu-courses"
        href="/_new/courses"
        Icon={ChalkboardTeacher}
        text={t("courses")}
        title={t("courses")}
        onClick={onClose}
      />,
      <MobileMenuItemOld
        key="mobile-menu-modules"
        href="/_new/study-modules"
        Icon={ListIcon}
        text={t("modules")}
        title={t("modules")}
        onClick={onClose}
      />,
      <Divider key="menu-divider-1" />,
    ]

    if (admin) {
      items.push(
        <MobileMenuItemOld
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
        <MobileMenuItemOld
          key="mobile-menu-profile"
          href="/_new/profile"
          Icon={User}
          text={userDisplayName}
          title={t("myProfile")}
          onClick={onClose}
        />,
        <MobileMenuItemOld
          key="mobile-menu-logout"
          Icon={SignOut}
          text={t("logout")}
          title={t("logout")}
          onClick={onSignOut}
        />,
      )
    } else {
      items.push(
        <MobileMenuItemOld
          href="/_new/sign-in"
          key="menu-login"
          Icon={SignIn}
          onClick={onClose}
          text={t("loginShort")}
          title={t("loginShort")}
        >
          {t("loginShort")}
        </MobileMenuItemOld>,
        <MobileMenuItemOld
          href="/_new/sign-up"
          key="menu-signup"
          Icon={Register}
          onClick={onClose}
          text={t("signUp")}
          title={t("signUp")}
        >
          {t("signUp")}
        </MobileMenuItemOld>,
      )
    }

    return items
  }, [loggedIn, onClose, t, admin, MobileMenuItemOld])*/

  return (
    <MobileMenuContainer>
      <IconButton onClick={onClick} aria-hidden>
        <HamburgerIcon sx={{ fontSize: 24 }} />
      </IconButton>
      <MobileMenu anchor="right" open={open} onClose={onClose}>
        <MobileMenuHeader>
          <Button variant="text" color="primary" onClick={onClose}>
            {t("close")}
            <RemoveIcon sx={{ fontSize: 16 }} />
          </Button>
        </MobileMenuHeader>
        <MobileMenuList>
          <MobileMenuItem href="/_new/courses" text={t("courses")} />
          <MobileMenuItem href="/_new/study-modules" text={t("modules")} />
          {admin && <MobileMenuItem href="/_new/admin" text="Admin" />}
        </MobileMenuList>
      </MobileMenu>
    </MobileMenuContainer>
  )
}
//})

export default MobileNavigationMenu
