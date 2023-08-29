import React, { createContext, useCallback, useMemo, useState } from "react"

import { useRouter } from "next/router"

import { useApolloClient } from "@apollo/client"
import {
  ButtonBase,
  Drawer,
  EnhancedListItemButton,
  ListItemButton,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import {
  isSubmenuItem,
  NavigationMenuItem,
  NavigationMenuShortcutItem,
} from "."
import ArrowRightIcon from "../Icons/ArrowRight"
import CaretLeftIcon from "../Icons/CaretLeft"
import CaretRightIcon from "../Icons/CaretRight"
import HamburgerIcon from "../Icons/Hamburger"
import RemoveIcon from "../Icons/Remove"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import { fontSize } from "/src/theme/util"
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

const MobileMenuButton = styled(ButtonBase)(
  ({ theme }) => `
  align-items: center;
  display: inline-flex;
  height: 100%;
  justify-content: center;
  width: 44px;
  background-color: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  text-transform: none;

  &[aria-expanded=true] {
    ${fontSize(16, 18)}
    font-weight: 700;
    align-items: center;
    background-color: transparent;
    border: none;
    color: ${theme.palette.common.brand.main};
    display: inline-flex;
    height: auto;
    letter-spacing: -0.3px;
    margin-left: auto;
    margin-right: -16px;
    padding: 16px;
    position: fixed;
    right: 16px;
    top: 12px;
    z-index: 1350;
    width: auto;

    svg {
      margin-left: 8px;
      fill: ${theme.palette.common.brand.main};
    }
    &:hover {
      background-color: transparent;
      cursor: pointer;
    }
  }
`,
) as typeof ButtonBase

const MobileMenuHeader = styled("section")`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 12px 80px 12px 16px;
  gap: 16px;
  align-items: center;
`

interface MobileMenuLevelProps {
  isOpen?: boolean
  level?: number
}

const MobileMenuLevelContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "isOpen" && prop !== "level",
})<MobileMenuLevelProps>(
  ({ theme, isOpen, level = 0 }) => `
  background-color: ${theme.palette.common.grayscale.white};
  display: block;
  height: 80vh;
  left: 0;
  position: ${level > 0 ? "absolute" : "relative"};
  top: 0;
  width: 100%;
  z-index: ${1300 + level};
  ${
    level > 0
      ? css`
          transform: translateX(100%);
          transition:
            transform 0.3s ease-in-out,
            visibility 0.3s ease-in-out,
            opacity 0.3s ease-in-out,
            max-height 0.3s ease-in-out;
        `.styles
      : "transform: none;"
  }
  visibility: hidden !important;
  max-height: 100vh;
  ${
    isOpen &&
    css`
      height: 80vh;
      transform: none;
      visibility: visible !important;
      padding-bottom: 96px;
      max-height: 100vh;
    `.styles
  }
`,
)

const MobileMenuList = styled("ul")`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

interface MobileMenuListItemProps {
  isHidden?: boolean
  isActive?: boolean
}

const MobileMenuListItem = styled("li", {
  shouldForwardProp: (prop) => prop !== "isHidden" && prop !== "isActive",
})<MobileMenuListItemProps>(
  ({ theme, isHidden, isActive }) => `
  margin: 0 0 4px;
  display: flex;
  padding: 0;

  background-color: ${theme.palette.common.grayscale.white};
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out, opacity 0.3s ease-in-out;
  ${isHidden ? `visibility: hidden !important;` : "visibility: visible;"};

  span {
    svg {
      color: ${
        isActive
          ? theme.palette.common.grayscale.black
          : theme.palette.common.brand.main
      };
    }
    ${fontSize(21, 28)}
    font-weight: 700;
    color: ${
      isActive
        ? theme.palette.common.grayscale.black
        : theme.palette.common.brand.light
    };
    letter-spacing: -0.42px;
    padding: 16px 0 16px 16px;

  }

  .submenu span {
    ${fontSize(16, 20)}
    font-weight: 600;
    align-items: center;
    display: flex;
    letter-spacing: -0.5px;
    text-decoration: none;
    width: 100%;
    padding: 12px 16px;
    color: ${
      isActive
        ? theme.palette.common.grayscale.black
        : theme.palette.common.brand.main
    };
  }
${
  isActive
    ? css`
        position: relative;
        &:before {
          border-left: 3px solid ${theme.palette.common.grayscale.black};
          content: "";
          height: 75%;
          left: 10px;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `.styles
    : ""
}

  &.Mui-selected {
    background-color: transparent;
    .MuiListItemText-primary {
      color: ${theme.palette.common.grayscale.dark};
    }
  }
`,
)

const MobileMenuListItemButton = styled(ListItemButton)`
  padding-top: 0;
  padding-bottom: 0;
  &:hover {
    background: transparent;
  }
` as EnhancedListItemButton

const MobileMenuListItemSubmenuButton = styled(ButtonBase)(
  ({ theme }) => `
  &:before {
    background-color: ${theme.palette.common.grayscale.medium};
    width: 1px;
    height: 32px;
    content: '';
    display: inline-block;
    transform: translateY(-50%);
    top: 50%;
    left: 0;
    position: absolute;
  }
`,
)

const MobileMenuBreadcrumbs = styled("div")`
  min-height: 44px;
`

const MobileMenuBreadcrumbButton = styled(ButtonBase)(
  ({ theme }) => `
  text-transform: none;
  ${fontSize(15, 22)}
  color: ${theme.palette.common.brand.light};
  align-items: center;
  background-color: transparent;
  border: 0 none;
  cursor: pointer;
  display: inline-flex;
  text-decoration: none;
  padding: 11px 0;
  text-align: left;

  &:hover {
    background-color: transparent;
  }

  svg {
    margin-right: 8px;
    fill: ${theme.palette.common.grayscale.black};
  }
`,
) as typeof ButtonBase

const MobileMenuContentContainer = styled("section")`
  overflow: hidden;
  position: relative;
  min-height: calc(100vh - 126px);
`

const MobileMenuShortcutsContainer = styled("div")(
  ({ theme }) => `
  margin-top: 24px;

  h2 {
    ${fontSize(18, 24)}
    font-weight: 700;
    color: ${theme.palette.common.grayscale.black};
    letter-spacing: -0.32px;
    margin: 0 15px 8px;
    padding: 16px;
  }
`,
)

const MobileMenuShortcutsList = styled("ul")`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
`

const MobileMenuShortcutsListItemButton = styled(ListItemButton)(
  ({ theme }) => `
  ${fontSize(16, 20)}
  font-weight: 600;
  align-items: center;
  color: ${theme.palette.common.brand.main};
  display: flex;
  letter-spacing: -0.5px;
  text-decoration: none;
  width: 100%;
  padding: 12px 16px;

  &:focus {
    outline: solid 2px ${theme.palette.common.additional.yellow.main};
    outline-offset: -2px;
  }

  &:hover {
    text-decoration: underline;
    background-color: transparent;
  }

  span {
    svg {
      fill: ${theme.palette.common.brand.main};
      display: inline-flex !imporant;
      margin-left: 6px;
      margin-right: 0;
    }
  }
`,
) as EnhancedListItemButton

interface MobileMenuItemProps {
  item: NavigationMenuItem
  level?: number
}

const MobileMenuItem = ({ item, level = 0 }: MobileMenuItemProps) => {
  const { currentLevel, setCurrentLevel, setBreadcrumbs } =
    useMobileMenuContext()
  const { pathname } = useRouter()

  const hasSubmenu = isSubmenuItem(item)
  const { href, label } = item
  const onClick = useEventCallback(() => {
    setBreadcrumbs((prev) => [...prev, item])
    setCurrentLevel(level + 1)
  })

  return (
    <MobileMenuListItem
      isHidden={level !== currentLevel}
      isActive={pathname === href}
      className={level > 0 ? "submenu" : undefined}
    >
      <MobileMenuListItemButton variant="text" href={href}>
        {level > 0 && <CaretRightIcon sx={{ fontSize: 10 }} />}
        <span>{label}</span>
      </MobileMenuListItemButton>
      {hasSubmenu && (
        <>
          <MobileMenuListItemSubmenuButton onClick={onClick}>
            <CaretRightIcon />
          </MobileMenuListItemSubmenuButton>
          <MobileMenuLevelContainer
            level={level + 1}
            isOpen={currentLevel >= level + 1}
          >
            <MobileMenuItems
              items={item.items}
              parent={item}
              level={level + 1}
            />
            {item.shortcuts && item.shortcuts.length > 0 && (
              <MobileMenuShortcuts items={item.shortcuts} level={level + 1} />
            )}
          </MobileMenuLevelContainer>
        </>
      )}
    </MobileMenuListItem>
  )
}

interface MobileMenuItemsProps {
  items: Array<NavigationMenuItem>
  level?: number
  parent?: NavigationMenuItem
}

const MobileMenuItems = ({
  items,
  parent,
  level = 0,
}: MobileMenuItemsProps) => (
  <MobileMenuList>
    {parent && (
      <MobileMenuListItemButton variant="text" href={parent.href}>
        <span>{parent.label}</span>
      </MobileMenuListItemButton>
    )}
    {items.map((item) => (
      <MobileMenuItem key={item.label} item={item} level={level} />
    ))}
  </MobileMenuList>
)

interface MobileMenuShortcutItemProps {
  item: NavigationMenuShortcutItem
  level?: number
}

const MobileMenuShortcutItem = ({
  item,
  level = 0,
}: MobileMenuShortcutItemProps) => {
  const { currentLevel } = useMobileMenuContext()
  const { href, label, external } = item

  return (
    <MobileMenuListItem
      isHidden={level !== currentLevel}
      className={level > 0 ? "submenu" : undefined}
    >
      <MobileMenuShortcutsListItemButton
        href={href}
        target={external ? "_blank" : undefined}
      >
        <CaretRightIcon sx={{ fontSize: 10 }} />
        <span>
          {label}
          {external && <ArrowRightIcon sx={{ fontSize: 12 }} />}
        </span>
      </MobileMenuShortcutsListItemButton>
    </MobileMenuListItem>
  )
}

interface MobileMenuShortcutsProps {
  items: Array<NavigationMenuShortcutItem>
  level?: number
}

const MobileMenuShortcuts = ({
  items,
  level = 0,
}: MobileMenuShortcutsProps) => {
  const t = useTranslator(CommonTranslations)

  return (
    <MobileMenuShortcutsContainer>
      <h2>{t("shortcuts")}</h2>
      <MobileMenuShortcutsList>
        {items.map((item) => (
          <MobileMenuShortcutItem key={item.label} item={item} level={level} />
        ))}
      </MobileMenuShortcutsList>
    </MobileMenuShortcutsContainer>
  )
}

interface MobileNavigationMenuProps {
  items: Array<NavigationMenuItem>
  shortcuts?: Array<NavigationMenuShortcutItem>
}

const MobileNavigationMenu = ({
  items: originalItems,
  shortcuts,
}: MobileNavigationMenuProps) => {
  const apollo = useApolloClient()
  const [open, setOpen] = useState(false)
  const { loggedIn, logInOrOut } = useLoginStateContext()
  const onLogOut = useCallback(
    () => signOut(apollo, logInOrOut),
    [apollo, logInOrOut],
  )
  const t = useTranslator(CommonTranslations)
  // TODO: move somewhere else, just POC
  const items = useMemo(
    () => [
      ...originalItems,
      ...(loggedIn
        ? [
            {
              href: "/_new/profile",
              label: t("myProfile"),
            },
            {
              href: "#",
              label: t("logout"),
              onClick: onLogOut,
            },
          ]
        : [
            {
              href: "/_new/sign-in",
              label: t("loginShort"),
            },
            {
              href: "/_new/sign-up",
              label: t("signUp"),
            },
          ]),
    ],
    [loggedIn, t],
  )

  const [currentLevel, setCurrentLevel] = useState(0)
  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<NavigationMenuItem | undefined>
  >([undefined])

  const onSubmenuClick = useEventCallback(() => {
    setCurrentLevel((level) => level + 1)
  })
  const onBackClick = useEventCallback(() => {
    setCurrentLevel((level) => level - 1)
    setBreadcrumbs((prev) => prev.slice(0, -1))
  })

  const onMenuToggle = useEventCallback(() => {
    setOpen((prevOpen) => !prevOpen)
  })

  const onClose = useEventCallback(() => {
    setOpen(false)
  })

  const menuContextValue = useMemo(
    () => ({
      currentLevel,
      setCurrentLevel,
      onSubmenuClick,
      onBackClick,
      breadcrumbs,
      setBreadcrumbs,
    }),
    [currentLevel, breadcrumbs, setBreadcrumbs, onSubmenuClick, onBackClick],
  )

  return (
    <MobileMenuContainer>
      <MobileMenuButton onClick={onMenuToggle}>
        <HamburgerIcon sx={{ fontSize: 24 }} aria-hidden />
      </MobileMenuButton>
      <MobileMenu
        anchor="right"
        open={open}
        PaperProps={{ component: "nav", role: "navigation", elevation: 0 }}
        onClose={onClose}
      >
        <MobileMenuContext.Provider value={menuContextValue}>
          <MobileMenuHeader>
            <MobileMenuBreadcrumbs>
              {currentLevel > 0 && (
                <MobileMenuBreadcrumbButton onClick={onBackClick}>
                  <CaretLeftIcon sx={{ fontSize: 10 }} />
                  {breadcrumbs.slice(-2)[0]?.label ?? t("toMainMenu")}
                </MobileMenuBreadcrumbButton>
              )}
            </MobileMenuBreadcrumbs>
            <MobileMenuButton onClick={onMenuToggle} aria-expanded={true}>
              {t("close")}
              <RemoveIcon sx={{ fontSize: 16 }} aria-hidden />
            </MobileMenuButton>
          </MobileMenuHeader>
          <MobileMenuContentContainer>
            <MobileMenuLevelContainer isOpen={currentLevel === 0}>
              <MobileMenuItems items={items} />
              {shortcuts && shortcuts.length > 0 && (
                <MobileMenuShortcuts items={shortcuts} />
              )}
            </MobileMenuLevelContainer>
          </MobileMenuContentContainer>
        </MobileMenuContext.Provider>
      </MobileMenu>
    </MobileMenuContainer>
  )
}

interface MobileMenuContextType {
  currentLevel: number
  setCurrentLevel: React.Dispatch<React.SetStateAction<number>>
  onSubmenuClick: () => void
  onBackClick: () => void
  breadcrumbs: Array<NavigationMenuItem | undefined>
  setBreadcrumbs: React.Dispatch<
    React.SetStateAction<Array<NavigationMenuItem | undefined>>
  >
}

const MobileMenuContext = createContext<MobileMenuContextType>(
  {} as MobileMenuContextType,
)
const useMobileMenuContext = () => React.useContext(MobileMenuContext)

export default MobileNavigationMenu
