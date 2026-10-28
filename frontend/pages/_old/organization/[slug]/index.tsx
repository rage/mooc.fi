import { Typography } from "@mui/material"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const OrganizationPage = () => {
  const t = useTranslator(CommonTranslations)

  return (
    <div>
      <Typography component="h1" variant="h2" gutterBottom>
        {t("organization")}
      </Typography>
      <p>{t("organizationPlaceholder")}</p>
    </div>
  )
}

export default OrganizationPage
