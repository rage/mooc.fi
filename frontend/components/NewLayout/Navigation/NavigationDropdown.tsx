import { useState } from "react"

import {
  ButtonBase,
  EnhancedButtonBase,
  EnhancedLink,
  EnhancedLinkProps,
  Link,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { NavigationLinkStyle } from "."
import ArrowRight from "../Icons/ArrowRight"
import CaretDownIcon from "../Icons/CaretDown"
import CaretRight from "../Icons/CaretRight"
import CaretUpIcon from "../Icons/CaretUp"

interface NavigationDropdownButtonProps {
  expanded?: boolean
}

const NavigationDropdownButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<NavigationDropdownButtonProps>(
  ({ theme, expanded }) => `
  ${NavigationLinkStyle.styles}
  position: relative;
  margin: 0;
  right: unset;
  top: unset;
  min-height: unset;
  border-radius: 0;
  color: ${theme.palette.common.brand.nearlyBlack};
  svg {
    fill: ${theme.palette.common.brand.nearlyBlack};
  }
  ${theme.breakpoints.up("xl")} {
    font-size: 1rem;
    line-height: 16px;
  }
  &:hover {
    cursor: pointer;
    color: ${theme.palette.common.brand.main};
    svg {
      fill: ${theme.palette.common.brand.main};
    }
    background-color: transparent;
  }
  ${
    expanded
      ? css`
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
        `.styles
      : ""
  }
`,
) as EnhancedButtonBase<"button", NavigationDropdownButtonProps>

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
    transition: none;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    justify-items: center;
    align-items: flex-start;
  }
`,
) as typeof Popover

const NavigationDropdownMenuPanelContainer = styled("div")`
  align-items: baseline;
  display: inline-flex;
  flex-direction: column;
  grid-column-start: 2;
`
const NavigationDropdownMenuList = styled(MenuList)`
  /**/
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

const NavigationDropdownContent = styled("div")`
  padding-left: 56px;
  display: inline-grid;
  grid-template-columns: 310px;
`

const NavigationDropdownMenuItem = styled(MenuItem)`
  padding: 0;
  :hover {
    background: transparent;
  }
`

const NavigationDropdownMenuItemLink = styled(Link)(
  ({ theme }) => `
  font-size: 1rem;
  line-height: 24px;
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
  font-size: 25px;
  line-height: 32px;
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

interface NavigationDropdownProps {
  href?: string
  label?: string
  name?: string
}

export const NavigationDropdownLink = ({
  name,
  href,
  label,
  children,
}: React.PropsWithChildren<NavigationDropdownProps>) => {
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
        expanded={open}
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
          <NavigationDropdownContent>
            <NavigationDropdownMenuList aria-labelledby={buttonName}>
              {children}
            </NavigationDropdownMenuList>
          </NavigationDropdownContent>
        </NavigationDropdownMenuPanelContainer>
      </NavigationDropdownMenu>
    </>
  )
}
