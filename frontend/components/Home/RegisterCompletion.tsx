import Container from "/components/Container"
import { H1NoBackground } from "/components/Text/headers"
import { PropsWithChildren } from "react"
import { Alert } from "@material-ui/core"
import RegisterCompletionTranslations from "/translations/register-completion"
import { useTranslator } from "/util/useTranslator"

interface RegisterCompletionProps {
  title: string
}

export default function RegisterCompletion({
  title,
  children,
}: PropsWithChildren<RegisterCompletionProps>) {
  const t = useTranslator(RegisterCompletionTranslations)

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
