import { useState } from "react"

import {
  Button,
  EnhancedButton,
  EnhancedLink,
  EnhancedLinkProps,
  Link,
  MenuItem,
  MenuList,
  Paper,
  Popover,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import ArrowRightIcon from "../Icons/ArrowRight"
import CaretDownIcon from "../Icons/CaretDown"
import CaretRight from "../Icons/CaretRight"
import CaretUpIcon from "../Icons/CaretUp"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const NavigationLinkStyle = css`
  font-size: 0.875rem;
  line-height: 16px;
  font-weight: 700;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  height: 100%;
  letter-spacing: -0.7px;
  padding: 26px 10px;
  width: auto;
  text-transform: uppercase;
  text-decoration: none;
  text-align: left;
  align-items: center;
  justify-content: center;
  transition: 0.1s;

  svg {
    pointer-events: none;
    margin-left: 4px;
    height: 10px;
    width: 10px;
    font-size: 10px;
  }
`
const NavigationLink = styled(Link)(
  ({ theme }) => `
  ${NavigationLinkStyle.styles}
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
  }
`,
) as EnhancedLink

interface NavigationDropdownButtonProps {
  expanded?: boolean
}

const NavigationDropdownButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "expanded",
})<NavigationDropdownButtonProps>(
  ({ theme, expanded }) => `
  ${NavigationLinkStyle.styles}
  position: relative;
  margin: 0;
  right: unset;
  top: unset;
  min-height: unset;
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
            bottom: -1px;
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
) as EnhancedButton<"button", NavigationDropdownButtonProps>

const NavigationDropdownMenu = styled(Popover)`
  left: -17px;
  top: 1px;
` as typeof Popover

const NavigationDropdownMenuPanel = styled(Paper)(
  ({ theme }) => `
  position: relative;
  width: max-content;
  max-width: 120rem;
  padding: 24px 16px 40px;
  border-radius: 0;
  background-color: ${theme.palette.common.grayscale.white};
  transition: none;
  top: 1px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  justify-items: center;
  align-items: flex-start;
  border: 1px solid ${theme.palette.common.grayscale.black};
  border-top: none;
  margin: 0 auto;
`,
)

const NavigationDropdownMenuPanelContainer = styled("div")`
  align-items: baseline;
  display: inline-flex;
  flex-direction: column;
  grid-column-start: 2;
`
const NavigationDropdownMenuList = styled(MenuList)`
  /**/
`

const NavigationLinksContainer = styled("nav")(
  ({ theme }) => `
  height: 100%;
  margin: 0 32px;
  display: block;
  ${theme.breakpoints.down("sm")} {
    display: none;
  }
`,
)

const NavigationLinkList = styled("ul")`
  display: flex;
  height: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`

const NavigationLinkItem = styled("li")`
  list-style: none;
  height: 100%;
  position: relative;
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

const NavigationDropdownContent = styled("div")`
  padding-left: 56px;
  display: inline-grid;
  grid-template-columns: 310px;
`

const NavigationDropdownMenuItem = styled(MenuItem)`
  padding: 0;
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

const NavigationDropdownMenuLink = ({
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

const NavigationDropdownLink = ({
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
        variant="text"
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
        <NavigationDropdownMenuPanel elevation={0}>
          <NavigationDropdownMenuPanelContainer>
            <NavigationDropdownMenuHeader>
              <NavigationIconWrapper>
                <ArrowRightIcon />
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
        </NavigationDropdownMenuPanel>
      </NavigationDropdownMenu>
    </>
  )
}
export const NavigationLinks = () => {
  const { admin } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  return (
    <NavigationLinksContainer role="navigation">
      <NavigationLinkList>
        <NavigationLinkItem>
          <NavigationLink href="/_new/courses">{t("courses")}</NavigationLink>
        </NavigationLinkItem>

        <NavigationLinkItem>
          <NavigationLink href="/_new/study-modules">
            {t("modules")}
          </NavigationLink>
        </NavigationLinkItem>

        {admin && (
          <NavigationLinkItem>
            <NavigationDropdownLink label="Admin" href="/_new/admin">
              <NavigationDropdownMenuLink href="/_new/admin/courses">
                {t("courses")}
              </NavigationDropdownMenuLink>
              <NavigationDropdownMenuLink href="/_new/admin/study-modules">
                {t("modules")}
              </NavigationDropdownMenuLink>
              <NavigationDropdownMenuLink href="/_new/admin/email-templates">
                {t("emailTemplates")}
              </NavigationDropdownMenuLink>
              <NavigationDropdownMenuLink href="/_new/admin/users/search">
                {t("userSearch")}
              </NavigationDropdownMenuLink>
            </NavigationDropdownLink>
          </NavigationLinkItem>
        )}
      </NavigationLinkList>
    </NavigationLinksContainer>
  )
}
