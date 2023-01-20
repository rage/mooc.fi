import Link from "next/link"

import { styled } from "@mui/material/styles"

import { useActiveTab } from "/components/NewLayout/Navigation"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const NavigationLink = styled("a", {
  shouldForwardProp: (prop) => prop !== "active",
})<React.ComponentProps<"a"> & { active: boolean }>`
  text-decoration: none;
  color: inherit;
  font-weight: ${({ active }) => (active ? "600" : "inherit")};
  font-size: clamp(14px, 1.5vw, 16px);

  &:hover {
    font-weight: 600;
  }
  transition: 0.1s;
`

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
      <Link href="/_new/courses" passHref>
        <NavigationLink active={active === "courses"}>
          {t("courses")}
        </NavigationLink>
      </Link>

      <Link href="/_new/study-modules" passHref>
        <NavigationLink active={active === "study-modules"}>
          {t("modules")}
        </NavigationLink>
      </Link>

      {admin && (
        <Link href="/_new/admin" passHref prefetch={false}>
          <NavigationLink active={active === "admin"}>Admin</NavigationLink>
        </Link>
      )}
    </NavigationLinkContainer>
  )
}
