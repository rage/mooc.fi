import Link from "next/link"

import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0 2rem;
`

export const Links = () => {
  const t = useTranslator(CommonTranslations)

  return (
    <Container>
      <Link href="/admin/courses">{t("courses")}</Link>
      <Link href="/admin/study-modules">{t("modules")}</Link>
      <Link href="/admin/email-templates">{t("emailTemplates")}</Link>
      <Link href="/admin/users/search">{t("userSearch")}</Link>
    </Container>
  )
}
