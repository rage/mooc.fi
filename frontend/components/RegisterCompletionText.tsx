import { Box, Button, EnhancedButton, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useRouter } from "next/router"

import { OutboundLinkTextStyle } from "./OutboundLink"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

// The Open University only publishes this page in Finnish and English; other languages fall
// back to the English version.
const OPEN_UNIVERSITY_ENROLLMENT_INFO_URL_FI =
  "https://www.helsinki.fi/fi/hakeminen-ja-opetus/avoin-yliopisto/ilmoittautuminen-ja-opintomaksut"
const OPEN_UNIVERSITY_ENROLLMENT_INFO_URL_EN =
  "https://www.helsinki.fi/en/admissions-and-education/open-university/enrollment-and-study-fees"

const RegisterCompletionContainer = styled(Paper)`
  padding: 1em;
  margin: 1em;
  display: flex;
  flex-direction: column;
`

const RegistrationLinkButton = styled(Button)`
  width: 65%;
  margin: auto;
  margin-bottom: 1em;
` as EnhancedButton

const RegistrationButtons = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const OutboundLinkText = styled(Typography)`
  ${OutboundLinkTextStyle}
` as typeof Typography

interface LinkButtonProps {
  link: string
  onRegistrationClick: (...args: any[]) => any
}

function LinkButton({ link, onRegistrationClick }: LinkButtonProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <RegistrationLinkButton
      variant="contained"
      color="secondary"
      size="medium"
      title={t("linkAria")}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onRegistrationClick}
    >
      <OutboundLinkText variant="h4" component="span">
        {t("link")}
      </OutboundLinkText>
    </RegistrationLinkButton>
  )
}

interface RegisterCompletionTextProps {
  email: string
  link: string
  tiers: any
  onRegistrationClick: (...args: any[]) => any
}
function RegisterCompletionText({
  email,
  link,
  tiers,
  onRegistrationClick,
}: RegisterCompletionTextProps) {
  const t = useTranslator(RegisterCompletionTranslations)
  const { locale } = useRouter()
  const infoUrl =
    locale === "fi"
      ? OPEN_UNIVERSITY_ENROLLMENT_INFO_URL_FI
      : OPEN_UNIVERSITY_ENROLLMENT_INFO_URL_EN

  return (
    <RegisterCompletionContainer>
      <Typography paragraph>{t("credits_details")}</Typography>
      <Typography
        paragraph
        dangerouslySetInnerHTML={{ __html: t("donow", { email, infoUrl }) }}
      />
      <Box
        padding={2}
        bgcolor="rgba(0,0,0,0.05)"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography paragraph alignSelf="flex-start">
          {t("grades")}
        </Typography>
        {tiers.length > 0 ? (
          tiers.map((tier: any) => (
            <RegistrationButtons key={tier.name}>
              <Typography paragraph align="center">
                {tier.name}
              </Typography>
              <LinkButton
                link={tier.link}
                onRegistrationClick={onRegistrationClick}
              />
            </RegistrationButtons>
          ))
        ) : (
          <LinkButton link={link} onRegistrationClick={onRegistrationClick} />
        )}
      </Box>
    </RegisterCompletionContainer>
  )
}

export default RegisterCompletionText
