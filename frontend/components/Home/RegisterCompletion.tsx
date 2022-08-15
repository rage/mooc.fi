import { PropsWithChildren } from "react"

import Container from "/components/Container"
import { H1NoBackground } from "/components/Text/headers"

interface RegisterCompletionProps {
  title: string
}

export default function RegisterCompletion({
  title,
  children,
}: PropsWithChildren<RegisterCompletionProps>) {
  return (
    <Container>
      {/* <Alert severity="warning" variant="filled">
        {t("registrationClosed")}
      </Alert> */}
      <H1NoBackground variant="h1" component="h1" align="center">
        {title}
      </H1NoBackground>
      {children}
    </Container>
  )
}
