import React from "react"
import styled from "styled-components"
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core"
import NexI18Next from "../../i18n"
import Send from "@material-ui/icons/Send"
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied"

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

const Header = styled(Typography)`
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
  const [sent, setSent] = React.useState(false)
  const formRef = React.createRef()

  function handleSubmit() {
    setSent(true)
  }

  return (
    <MailingList>
      <StyledCard>
        <CardContent>
          <StyledHeader variant="h5">
            <NexI18Next.Trans i18nKey="emailHeader" />
          </StyledHeader>
          <div>
            {sent ? (
              <Typography variant="subtitle1">
                <NexI18Next.Trans i18nKey="emailThanks" />
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
                      label={<NexI18Next.Trans i18nKey="emailField" />}
                      name="EMAIL"
                    />
                  </StyledFormControl>
                </FieldWrapper>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    formRef.current.submit()
                    handleSubmit()
                  }}
                >
                  <NexI18Next.Trans i18nKey="emailButton" />
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
