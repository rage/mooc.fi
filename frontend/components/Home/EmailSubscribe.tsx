import { createRef, useCallback, useState } from "react"

import Send from "@mui/icons-material/Send"
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied"
import {
  Button,
  Card,
  CardContent,
  FormControl,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

const MailingList = styled("div")`
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

const FieldWrapper = styled("div")`
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

  const handleSubmit = useCallback(() => {
    if (formRef?.current) {
      formRef.current.submit()
      setSent(true)
    }
  }, [formRef?.current])

  return (
    <MailingList>
      <StyledCard>
        <CardContent>
          <StyledHeader variant="h5" as="h4">
            {t("emailHeader")}
          </StyledHeader>
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
                  onClick={handleSubmit}
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
