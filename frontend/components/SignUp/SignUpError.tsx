import { StyledPaper, Header, StyledTypography } from "./common"
import SignUpTranslations from "/translations/sign-up"
import { useTranslator } from "/util/useTranslator"

type SignUpError =
  | "verify-user"
  | "already-registered"
  | "token-issue"
  | "generic-error"

interface SignUpErrorProps {
  type?: SignUpError
  email?: string
}

function SignUpError({ type = "generic-error", email }: SignUpErrorProps) {
  const t = useTranslator(SignUpTranslations)

  return (
    <StyledPaper>
      <Header component="h1" variant="h4" gutterBottom={true} align="center">
        {t("errorTitle")}
      </Header>
      <StyledTypography
        component="p"
        paragraph
        dangerouslySetInnerHTML={{ __html: t(type, { email }) }}
      />
    </StyledPaper>
  )
}

export default SignUpError
