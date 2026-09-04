import { Button, EnhancedButton, Typography } from "@mui/material"
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

const RegisterCompletionContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InstructionText = styled(Typography)`
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: #313947;
` as typeof Typography

const RegistrationLinkButton = styled(Button)`
  align-self: flex-start;
  /* Long labels have to wrap on narrow screens, so the fixed control height gives way. */
  height: auto;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  line-height: 1.3;
  text-align: left;
` as EnhancedButton

const TierBlock = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`

const TierName = styled(Typography)`
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: #1a2333;
` as typeof Typography

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
      color="primary"
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
      <InstructionText>{t("credits_details")}</InstructionText>
      <InstructionText
        dangerouslySetInnerHTML={{ __html: t("donow", { email, infoUrl }) }}
      />
      <InstructionText>{t("grades")}</InstructionText>
      {tiers.length > 0 ? (
        tiers.map((tier: any) => (
          <TierBlock key={tier.name}>
            <TierName>{tier.name}</TierName>
            <LinkButton
              link={tier.link}
              onRegistrationClick={onRegistrationClick}
            />
          </TierBlock>
        ))
      ) : (
        <LinkButton link={link} onRegistrationClick={onRegistrationClick} />
      )}
    </RegisterCompletionContainer>
  )
}

export default RegisterCompletionText
