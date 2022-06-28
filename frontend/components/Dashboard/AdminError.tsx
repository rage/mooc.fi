import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"
import { Typography } from "@mui/material"

function AdminError() {
  const t = useTranslator(CommonTranslations)

  return (
    <section>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
      >
        {t("adminSorry")}
      </Typography>
      <Typography variant="body1" gutterBottom={true} align="center">
        {t("adminError")}
      </Typography>
    </section>
  )
}

export default AdminError
