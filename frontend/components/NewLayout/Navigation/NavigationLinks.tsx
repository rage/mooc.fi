import { EnhancedLink, Link } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { useActiveTab } from "/components/NewLayout/Navigation"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

interface NavigationLinkProps {
  active: boolean
}

const NavigationLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<NavigationLinkProps>`
  text-decoration: none;
  color: inherit;
  font-size: 1rem;
  padding: 0.2rem;
  ${({ active }) =>
    active
      ? css`
          border-bottom: 2px solid rgba(200, 100, 0, 0.25);
          font-weight: 600;
        `
      : css`
          &:hover {
            text-shadow: 0px 0px 1px black;
          }
        `}

  transition: 0.1s;
` as EnhancedLink<"a", NavigationLinkProps>

const NavigationLinkContainer = styled("div")`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
`

export const NavigationLinks = () => {
  const { admin } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)
  const active = useActiveTab()

  return (
    <NavigationLinkContainer>
      <NavigationLink href="/_new/courses" active={active === "courses"}>
        {t("courses")}
      </NavigationLink>

      <NavigationLink
        href="/_new/study-modules"
        active={active === "study-modules"}
      >
        {t("modules")}
      </NavigationLink>

      {admin && (
        <NavigationLink
          href="/_new/admin"
          prefetch={false}
          active={active === "admin"}
        >
          Admin
        </NavigationLink>
      )}
    </NavigationLinkContainer>
  )
}
