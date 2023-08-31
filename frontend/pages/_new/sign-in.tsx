import Typography from "@mui/material/Typography"

import ContentWrapper from "/components/NewLayout/Common/ContentWrapper"
import SignInForm from "/components/SignInForm"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useTranslator } from "/hooks/useTranslator"
import withSignedOut from "/lib/with-signed-out"
import SignInTranslations from "/translations/common"

const SignInPage = () => {
  const t = useTranslator(SignInTranslations)

  useBreadcrumbs([
    {
      translation: "signIn",
      href: "/_new/sign-in",
    },
  ])

  return (
    <ContentWrapper sx={{ margin: "0 auto", maxWidth: "600px !important" }}>
      <Typography variant="h4" component="h2">
        {t("login")}
      </Typography>
      <Typography variant="body1">{t("loginDetails")}</Typography>
      <SignInForm sx={{ padding: "1rem 0" }} />
    </ContentWrapper>
  )
}

//If user is already logged in, redirect them straight to
//register-completion page
export default withSignedOut("/_new")(SignInPage)
