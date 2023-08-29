import { PropsOf } from "@emotion/react"
import { EnhancedLink, Link } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { isSubmenuItem, NavigationMenuItem } from "."
import { NavigationDropdownLink } from "./NavigationDropdown"

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
  position: relative;

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

const NavigationLinksContainer = styled("nav")(
  ({ theme }) => `
  height: 100%;
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

interface NavigationItemProps {
  item: NavigationMenuItem
}

const NavigationItem = ({ item }: NavigationItemProps) => {
  const { name, label, href, onClick } = item
  return (
    <NavigationLinkItem key={name ?? label}>
      {isSubmenuItem(item) ? (
        <NavigationDropdownLink item={item} />
      ) : (
        <NavigationLink href={href} onClick={onClick}>
          {label}
        </NavigationLink>
      )}
    </NavigationLinkItem>
  )
}

interface NavigationLinksProps {
  items: Array<NavigationMenuItem>
}

export const NavigationLinks = ({
  items,
  ...props
}: NavigationLinksProps & PropsOf<typeof NavigationLinksContainer>) => {
  return (
    <NavigationLinksContainer role="navigation" {...props}>
      <NavigationLinkList>
        {items.map((item) => (
          <NavigationItem key={item.name ?? item.label} item={item} />
        ))}
      </NavigationLinkList>
    </NavigationLinksContainer>
  )
}
