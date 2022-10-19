import { Button, Paper, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import RegisterCompletionTranslations from "/translations/register-completion"
import { useTranslator } from "/util/useTranslator"

const LinkTooltip = styled(Tooltip)`
  background-color: white;
  font-size: 11px;
  color: black;
  border: 1px solid black;
`

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
`

const RegistrationButtons = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface LinkButtonProps {
  link: string
  onRegistrationClick: Function
}

function LinkButton({ link, onRegistrationClick }: LinkButtonProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  const onClick = () => {
    try {
      window.open(link, "_blank", "noopener noreferrer")
      onRegistrationClick()
    } catch {
      console.error("error opening registration link")
    }
  }

  return (
    <LinkTooltip title={t("linkAria")} placement="bottom">
      <RegistrationLinkButton
        variant="contained"
        color="secondary"
        size="medium"
        role="link"
        onClick={onClick}
      >
        <Typography variant="h4">{t("link")}</Typography>
      </RegistrationLinkButton>
    </LinkTooltip>
  )
}

interface RegisterCompletionTextProps {
  email: String
  link: string
  tiers: any
  onRegistrationClick: Function
}
function RegisterCompletionText({
  email,
  link,
  tiers,
  onRegistrationClick,
}: RegisterCompletionTextProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <RegisterCompletionContainer>
      <Typography variant="body1" paragraph>
        {t("credits_details")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("donow")}
      </Typography>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom={true}
        align="center"
      >
        {t("instructions-title")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions2")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions3")} {email}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("Instructions4")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t("grades")}
      </Typography>
      {tiers.length > 0 ? (
        tiers.map((tier: any, i: number) => (
          <RegistrationButtons key={i}>
            <Typography variant="body1" paragraph align="center">
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
    </RegisterCompletionContainer>
  )
}

export default RegisterCompletionText
