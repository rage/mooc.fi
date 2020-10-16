import { useContext } from "react"
import { Typography } from "@material-ui/core"
import getCommonTranslator from "/translations/common"
import LanguageContext from "/contexes/LanguageContext"

function AdminError() {
  const { language } = useContext(LanguageContext)
  const t = getCommonTranslator(language)

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
