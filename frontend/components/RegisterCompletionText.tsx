import {
  Box,
  Button,
  EnhancedButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { OutboundLinkTextStyle } from "./OutboundLink"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

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

const InstructionList = styled(List)`
  list-style: decimal;
` as typeof List

const InstructionListItem = styled(ListItem)`
  display: list-item;
  margin-left: 1rem;

  &::marker {
    font-weight: 600;
  }
`

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

  console.log(tiers)
  return (
    <RegisterCompletionContainer>
      <Typography paragraph>{t("credits_details")}</Typography>
      <Typography paragraph>{t("donow")}</Typography>
      <Box
        padding={2}
        bgcolor="rgba(0,0,0,0.05)"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="h3" component="h2" gutterBottom>
          {t("instructions-title")}
        </Typography>
        <InstructionList component="ol">
          <InstructionListItem>
            <Typography
              dangerouslySetInnerHTML={{
                __html: t("Instructions1"),
              }}
            />
          </InstructionListItem>
          <InstructionListItem>
            <Typography
              dangerouslySetInnerHTML={{
                __html: t("Instructions2", { email }),
              }}
            />
          </InstructionListItem>
          <InstructionListItem>
            <Typography
              dangerouslySetInnerHTML={{
                __html: t("Instructions3"),
              }}
            />
          </InstructionListItem>
        </InstructionList>
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
