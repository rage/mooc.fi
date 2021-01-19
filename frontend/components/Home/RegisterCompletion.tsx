import Container from "/components/Container"
import { H1NoBackground } from "/components/Text/headers"
import { PropsWithChildren, useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import getRegisterCompletionTranslator from "/translations/register-completion"
import Alert from "@material-ui/lab/Alert"

interface RegisterCompletionProps {
  title: string
}

export default function RegisterCompletion({
  title,
  children,
}: PropsWithChildren<RegisterCompletionProps>) {
  const { language } = useContext(LanguageContext)
  const t = getRegisterCompletionTranslator(language)

  return (
    <Container>
      <Alert severity="warning" variant="filled">
        {t("registrationClosed")}
      </Alert>
      <H1NoBackground variant="h1" component="h1" align="center">
        {title}
      </H1NoBackground>
      {children}
    </Container>
  )
}
