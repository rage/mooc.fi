import { EnhancedLink, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useActiveTab } from "/components/NewLayout/Navigation"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

interface NavigationLinkProps {
  active: boolean
}

const NavigationLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<NavigationLinkProps>(
  ({ theme, active }) => `
  font-size: 0.875rem;
  line-height: 16px;
  font-weight: 700;
  background-color: transparent;
  border: none;
  color: ${theme.palette.common.brand.nearlyBlack};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  height: 100%;
  letter-spacing: -0.7px;
  padding: 12px 10px 13px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: left;
  align-items: flex-start;
  transition: 0.1s;
  ${active && `border-bottom: 2px solid ${theme.palette.common.brand.active};`}
  &:hover {
    color: ${theme.palette.common.brand.main};
  }
`,
) as EnhancedLink<"a", NavigationLinkProps>

const NavigationContainer = styled("nav")`
  display: flex;
  margin: 0 32px;
  align-items: center;
  flex-flow: row;
  justify-content: center;
  padding: 0;
`

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
`

export const NavigationLinks = () => {
  const { admin } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)
  const active = useActiveTab()

  return (
    <NavigationContainer role="navigation">
      <NavigationLinkList>
        <NavigationLinkItem>
          <NavigationLink href="/_new/courses" active={active === "courses"}>
            {t("courses")}
          </NavigationLink>
        </NavigationLinkItem>

        <NavigationLinkItem>
          <NavigationLink
            href="/_new/study-modules"
            active={active === "study-modules"}
          >
            {t("modules")}
          </NavigationLink>
        </NavigationLinkItem>

        {admin && (
          <NavigationLinkItem>
            <NavigationLink
              href="/_new/admin"
              prefetch={false}
              active={active === "admin"}
            >
              Admin
            </NavigationLink>
          </NavigationLinkItem>
        )}
      </NavigationLinkList>
    </NavigationContainer>
  )
}
