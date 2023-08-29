import { PropsOf } from "@emotion/react"
import { EnhancedLink, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import { isSubmenuItem, NavigationLinkStyle, NavigationMenuItem } from "."
import { NavigationDropdownLink } from "./NavigationDropdown"
import { fontSize } from "/src/theme/util"

const NavigationLink = styled(Link)(
  ({ theme }) => `
  ${NavigationLinkStyle.styles}
  color: ${theme.palette.common.brand.nearlyBlack};
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
  }
`,
) as EnhancedLink

const NavigationLinksContainer = styled("nav")(
  ({ theme }) => `
  display: none;
  ${theme.breakpoints.up("sm")} {
    height: 100%;
    display: block;
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
