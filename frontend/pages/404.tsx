import { Typography } from "@mui/material"

import ContentWrapper from "/components/NewLayout/Common/ContentWrapper"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const NotFoundPage = () => {
  const t = useTranslator(CommonTranslations)
  useBreadcrumbs([])

  return (
    <ContentWrapper as="section" sx={{ textAlign: "center" }}>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom
        sx={{ justifyContent: "center" }}
      >
        404
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t("pageNotFound")}
      </Typography>
    </ContentWrapper>
  )
}

export default NotFoundPage
