import React from "react"

import { useRouter } from "next/router"

import Warning from "@mui/icons-material/Warning"
import { EnhancedLink, Link as MUILink, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

const ConsentNotificationWrapper = styled("div")`
  display: flex;
  padding: 6px 16px;
  line-height: 1.43;
  border-radius: 4px;
  letter-spacing: 0.01071em;
  background-color: rgb(255, 244, 229);
`

const Link = MUILink as EnhancedLink

function ConsentNotification() {
  const t = useTranslator(ProfileTranslations)
  const { locale } = useRouter()

  return (
    <ConsentNotificationWrapper>
      <Warning />
      <Typography variant="h4" component="h2">
        {t("researchNotification1")}
        <Link href="/profile?tab=settings" shallow>
          {t("researchNotificationLink")}
        </Link>
        {locale !== "fi" && <span>&nbsp;</span>}
        {t("researchNotification2")}
      </Typography>
    </ConsentNotificationWrapper>
  )
}

export default ConsentNotification
