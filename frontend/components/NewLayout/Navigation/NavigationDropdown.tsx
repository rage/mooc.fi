import { useState } from "react"

import {
  ButtonBase,
  EnhancedButtonBase,
  EnhancedLink,
  EnhancedLinkProps,
  Link,
  Popover,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import {
  NavigationLinkStyle,
  NavigationMenuShortcutItem,
  NavigationMenuSubmenuItem,
} from "."
import ArrowRight from "../Icons/ArrowRight"
import CaretDownIcon from "../Icons/CaretDown"
import CaretRight from "../Icons/CaretRight"
import CaretUpIcon from "../Icons/CaretUp"
import { useTranslator } from "/hooks/useTranslator"
import { fontSize } from "/src/theme/util"
import CommonTranslations from "/translations/common"

const NavigationDropdownButton = styled(ButtonBase)(
  ({ theme }) => `
  ${NavigationLinkStyle.styles}
  position: relative;
  margin: 0;
  border-radius: 0;
  height: 100%;
  color: ${theme.palette.common.brand.nearlyBlack};
  transition: none !important;
  svg {
    fill: ${theme.palette.common.brand.nearlyBlack};
  }
  ${theme.breakpoints.up("xl")} {
    ${fontSize(16, 16)}
  }
  &:hover {
    cursor: pointer;
    color: ${theme.palette.common.brand.main};
    svg {
      fill: ${theme.palette.common.brand.main};
    }
    background-color: transparent;
  }

  &[aria-expanded="true"] {
    position: relative;
    &::after,
    &::before {
      background-color: ${theme.palette.common.grayscale.white};
      content: "";
      height: 5px;
      width: 16px;
      position: absolute;
      bottom: -3px;
      z-index: 3000 !important;
    }

    &::before {
      left: -16px;
    }

    &::after {
      right: -16px;
    }

    box-shadow: inset 0 -4px 0 0 ${theme.palette.common.grayscale.black};
  }
`,
) as EnhancedButtonBase

const NavigationDropdownMenu = styled(Popover)(
  ({ theme }) => `
  left: -17px;
  top: 2px;

  ${theme.breakpoints.up("lg")} {
    top: 1px;
  }

  .MuiPopover-paper {
    width: max-content;
    max-width: 120rem;
    padding: 24px 16px 40px;
    border: 1px solid ${theme.palette.common.grayscale.black};
    border-top: none;
    border-radius: 0;
    transition: none !important;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    justify-items: center;
    align-items: flex-start;
    margin: 0 auto;
  }
`,
) as typeof Popover

const NavigationDropdownMenuPanelContainer = styled("div")`
  align-items: baseline;
  display: inline-flex;
  flex-direction: column;
  grid-column-start: 2;
`

const NavigationDropdownMenuList = styled("ul")`
  padding: 0;
  margin: 0;
  display: inline-grid;
  gap: 20px;
  list-style: none;
`

const NavigationDropdownMenuHeader = styled("div")(
  ({ theme }) => `
  display: inline-grid;
  gap: 8px 16px;
  grid-template-areas: 'icon link' 'icon description';
  grid-template-columns: auto;
  grid-template-rows: auto;
  margin-bottom: 16px;
  align-items: flex-start;

  svg {
    fill: ${theme.palette.common.grayscale.white};
  }
`,
)

interface NavigationDropdownContentProps {
  hasShortcuts?: boolean
}

const NavigationDropdownContent = styled("div")<NavigationDropdownContentProps>(
  ({ hasShortcuts }) => `
  padding-left: 56px;
  display: inline-grid;
  grid-template-columns: ${hasShortcuts ? "400px 496px" : "310px"};
`,
)

const NavigationDropdownMenuItem = styled("li")`
  list-style: none;
  padding: 0;
`

const NavigationDropdownMenuItemLink = styled(Link)(
  ({ theme }) => `
  ${fontSize(16, 24)}
  font-weight: 600;
  align-items: flex-start;
  color: ${theme.palette.common.brand.main};
  display: inline-flex;
  letter-spacing: -0.5px;
  overflow: hidden;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
 
  svg {
    margin-right: 12px;
    margin-top: 8px;
    fill: ${theme.palette.common.grayscale.black};
  }
`,
) as EnhancedLink

const NavigationDropdownHeaderLink = styled(Link)`
  ${fontSize(25, 32)}
  font-weight: 700;
  grid-area: link;
  letter-spacing: -0.5px;
  margin-top: 4px;
  text-decoration: none;
  width: max-content;

  :hover {
    text-decoration: underline;
  }
` as EnhancedLink

const NavigationIconWrapper = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.black};
  display: flex;
  grid-area: icon;
  height: 40px;
  justify-content: center;
  align-items: center;
  width: 40px;
`,
)

export const NavigationDropdownMenuLink = ({
  children,
  ...props
}: EnhancedLinkProps) => (
  <NavigationDropdownMenuItem>
    <NavigationDropdownMenuItemLink {...props}>
      <CaretRight sx={{ fontSize: 10 }} />
      {children}
    </NavigationDropdownMenuItemLink>
  </NavigationDropdownMenuItem>
)

const NavigationDropdownShortcutContainer = styled("div")(
  ({ theme }) => `
  margin-left: 48px;
  padding-left: 48px;
  border-left: 1px solid ${theme.palette.common.grayscale.medium};

  h2 {
    ${fontSize(18, 24)}
    font-weight: 700;
    color: ${theme.palette.common.grayscale.black};
    letter-spacing: -0.36px;
    margin: 0 0 24px;
  }
`,
)

interface NavigationDropdownShortcutsProps {
  items: Array<NavigationMenuShortcutItem>
}

const NavigationDropdownShortcuts = ({
  items,
}: NavigationDropdownShortcutsProps) => {
  const t = useTranslator(CommonTranslations)
  return (
    <NavigationDropdownShortcutContainer>
      <h2>{t("shortcuts")}</h2>
      <NavigationDropdownMenuList>
        {items.map(({ href, label, name, external }) => (
          <NavigationDropdownMenuLink
            key={name ?? label}
            href={href}
            target={external ? "_blank" : undefined}
          >
            <span>
              {label}
              {external && <ArrowRight sx={{ fontSize: "12px" }} />}
            </span>
          </NavigationDropdownMenuLink>
        ))}
      </NavigationDropdownMenuList>
    </NavigationDropdownShortcutContainer>
  )
}
interface NavigationDropdownProps {
  item: NavigationMenuSubmenuItem
}

export const NavigationDropdownLink = ({
  item,
}: React.PropsWithChildren<NavigationDropdownProps>) => {
  const { name, label, href, items, shortcuts } = item
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const onClick = useEventCallback(
    (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      setAnchorEl(event.currentTarget)
    },
  )
  const onClose = useEventCallback(() => {
    setAnchorEl(null)
  })

  const buttonName = name ?? label ?? "dropdown"
  const menuName = `${buttonName}-menu`

  return (
    <>
      <NavigationDropdownButton
        id={buttonName}
        aria-controls={open ? menuName : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={onClick}
      >
        {label}
        {open ? <CaretUpIcon /> : <CaretDownIcon />}
      </NavigationDropdownButton>
      <NavigationDropdownMenu
        id={menuName}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        onClose={onClose}
        elevation={0}
        aria-hidden
      >
        <NavigationDropdownMenuPanelContainer>
          <NavigationDropdownMenuHeader>
            <NavigationIconWrapper>
              <ArrowRight />
            </NavigationIconWrapper>
            <NavigationDropdownHeaderLink href={href}>
              {label}
            </NavigationDropdownHeaderLink>
          </NavigationDropdownMenuHeader>
          <NavigationDropdownContent
            hasShortcuts={(shortcuts ?? []).length > 0}
          >
            <NavigationDropdownMenuList aria-labelledby={buttonName}>
              {items.map(({ name, label, href }) => (
                <NavigationDropdownMenuLink key={name ?? label} href={href}>
                  {label}
                </NavigationDropdownMenuLink>
              ))}
            </NavigationDropdownMenuList>
            {shortcuts && shortcuts.length > 0 && (
              <NavigationDropdownShortcuts items={shortcuts} />
            )}
          </NavigationDropdownContent>
        </NavigationDropdownMenuPanelContainer>
      </NavigationDropdownMenu>
    </>
  )
}
