import { useState, createRef } from "react"
import styled from "styled-components"
import Send from "@material-ui/icons/Send"
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import HomeTranslations from "/translations/home"
import { useTranslator } from "/util/useTranslator"

const MailingList = styled.div`
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  background-color: #f6f9fc;
  border-bottom: 2px solid rgba(207, 215, 223, 0.25);
`

const StyledCard = styled(Card)`
  width: 90%;
  max-width: 40rem;
  padding: 1rem;
  margin: 0 1rem;
`

const Header = styled(Typography)<any>`
  text-align: center;
  margin-bottom: 4rem !important;
`

const StyledHeader = styled(Header)`
  margin-bottom: 2rem !important;
`

const FieldWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const StyledFormControl = styled(FormControl)`
  flex: 1;
`

const StyledButton = styled(Button)`
  margin-left: 1rem !important;
  svg {
    margin-left: 5px;
  }
`

function EmailSubscribe() {
  const [sent, setSent] = useState(false)
  const formRef = createRef<HTMLFormElement>()
  const t = useTranslator(HomeTranslations)

  function handleSubmit() {
    setSent(true)
  }

  return (
    <MailingList>
      <StyledCard>
        <CardContent>
          <StyledHeader variant="h5">{t("emailHeader")}</StyledHeader>
          <div>
            {sent ? (
              <Typography variant="subtitle1">
                {t("emailThanks")}
                <SentimentSatisfiedIcon />
              </Typography>
            ) : (
              <form
                ref={formRef}
                action="https://mooc.us8.list-manage.com/subscribe/post?u=db82662e446284fd41bd8370e&amp;id=46d3d4ede3"
                method="post"
                name="mc-embedded-subscribe-form"
                target="_blank"
                noValidate
              >
                <FieldWrapper>
                  <StyledFormControl>
                    <TextField
                      id="email"
                      label="email"
                      name="EMAIL"
                      inputProps={{ "aria-label": "email" }}
                    />
                  </StyledFormControl>
                </FieldWrapper>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (formRef?.current) {
                      formRef.current.submit()
                      handleSubmit()
                    }
                  }}
                >
                  {t("emailButton")}
                  <Send />
                </StyledButton>
              </form>
            )}
          </div>
        </CardContent>
      </StyledCard>
    </MailingList>
  )
}

export default EmailSubscribe
