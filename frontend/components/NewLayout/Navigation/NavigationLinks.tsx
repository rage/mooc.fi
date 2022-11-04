import { Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useActiveTab } from "/components/NewLayout/Navigation"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const NavigationLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})<React.ComponentProps<"a"> & { active: boolean }>`
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "inherit")};
  font-size: clamp(12px, 1.5vw, 16px);

  &:hover {
    font-weight: 600;
  }
  transition: 0.1s;
`

const NavigationLinkContainer = styled("div")`
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 2rem;
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
