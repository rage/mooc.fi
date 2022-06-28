import React from "react"

import Link from "next/link"
import { useRouter } from "next/router"

import styled from "@emotion/styled"
import Warning from "@mui/icons-material/Warning"
import { Typography } from "@mui/material"

import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

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
  const { locale } = useRouter()

  return (
    <ConsentNotificationWrapper>
      <Warning />
      <Typography variant="h4" component="h2">
        {t("researchNotification1")}
        <Link href="/profile?tab=settings" shallow passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a>{t("researchNotificationLink")}</a>
        </Link>
        {locale !== "fi" && <span>&nbsp;</span>}
        {t("researchNotification2")}
      </Typography>
    </ConsentNotificationWrapper>
  )
}
