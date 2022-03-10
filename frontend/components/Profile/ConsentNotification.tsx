import Warning from "@mui/icons-material/Warning"
import styled from "@emotion/styled"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"
import React from "react"
import LangLink from "/components/LangLink"
import { useLanguageContext } from "/contexts/LanguageContext"
import { Typography } from "@mui/material"

const ConsentNotificationWrapper = styled.div`
  display: flex;
  padding: 6px 16px;
  line-height: 1.43;
  border-radius: 4px;
  letter-spacing: 0.01071em;
  background-color: rgb(255, 244, 229);
`

export default function ConsentNotification() {
  const t = useTranslator(ProfileTranslations)
  const { language } = useLanguageContext()

  return (
    <ConsentNotificationWrapper>
      <Warning />
      <Typography variant="h4" component="h2">
        {t("researchNotification1")}
        <LangLink href="/profile?tab=settings" shallow>
          {t("researchNotificationLink")}
        </LangLink>
        {language !== "fi" && <span>&nbsp;</span>}
        {t("researchNotification2")}
      </Typography>
    </ConsentNotificationWrapper>
  )
}
