import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styled from "@emotion/styled"
import { decision, getAuthorization, signIn } from "../../services/moocfi"

import Container from "../../components/Container"
import Paper from "@material-ui/core/Paper"
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Link,
} from "@material-ui/core"
import Typography from "@material-ui/core/Typography"
import { FormSubmitButton as SubmitButton } from "../../components/Buttons/FormSubmitButton"

import CommonTranslations from "../../translations/common"
import { useTranslator } from "../../util/useTranslator"

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 2em;
`

const Header = styled(Typography)<any>`
  margin: 1em;
`

const AllowButton = styled.div`
  font-size: 18px;
  cursor: pointer;
  background: #ffc107;
  width: 100%;
  max-width: 320px;
  padding: 10px 0px;
  text-align: center;
  margin: 10px 0px;
  border-radius: 5px;

  &:hover {
    opacity: 0.8;
  }
`

const DenyButton = styled.div`
  font-size: 18px;
  cursor: pointer;
  background: #dddddd;
  width: 100%;
  max-width: 320px;
  padding: 10px 0px;
  text-align: center;
  margin: 10px 0px;
  border-radius: 5px;

  &:hover {
    opacity: 0.8;
  }
`

const Authorization = () => {
  const router = useRouter()
  const t = useTranslator(CommonTranslations)

  const [showForm, setShowForm] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [redirectUri, setRedirectUri] = useState("")
  const [showTrusted, setShowTrusted] = useState(false)

  useEffect(() => {
    authorize()
  }, [])

  const authorize = async () => {
    try {
      const res = await getAuthorization(router.query.code)
      setRedirectUri(res.redirectUri)
      setShowTrusted(res.trusted)

      if (res.trusted) {
        getDecision(true)
      }
    } catch (error) {
      if (error.response.data.status === 404) {
        setShowError(true)
        setErrorMessage(error.response.data.message)
      } else if (error.response.data.status === 403) {
        setShowForm(true)
        setRedirectUri(error.response.data.redirectUri)
      }
    }
  }

  const getDecision = async (choice: boolean) => {
    if (choice === true) {
      try {
        const res = await decision(router.query.code)
        router.push(res)
      } catch (error) {
        router.push(redirectUri)
      }
    } else {
      router.push(redirectUri)
    }
  }

  const postSignIn = async () => {
    try {
      await signIn(email, password)
      setShowForm(false)
      setShowError(false)
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.data.message)
    }
  }

  if (showForm) {
    return (
      <Container style={{ width: "90%", maxWidth: 900 }}>
        <StyledPaper>
          <Header component="h1" variant="h4" gutterBottom={true}>
            {t("login")}
          </Header>
          <FormControl required fullWidth error={error}>
            <InputLabel htmlFor="email">{t("username")}</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="nope"
              onChange={(o) => {
                setEmail(o.target.value)
                setError(false)
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth error={error}>
            <InputLabel htmlFor="password">{t("password")}</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              autoComplete="nope"
              onChange={(o) => {
                setPassword(o.target.value)
                setError(false)
              }}
            />
            <FormHelperText error={error}>{error && t("error")}</FormHelperText>
          </FormControl>
          <SubmitButton
            type="submit"
            data-testid="login-button"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={email.trim() === "" || password.trim() === ""}
            onClick={async (e) => {
              e.preventDefault()
              try {
                await postSignIn()
              } catch (error) {
                setError(true)
              }
            }}
          >
            {t("login")}
          </SubmitButton>
          <Link
            href="https://tmc.mooc.fi/password_reset_keys/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("forgottenpw")}
          </Link>
        </StyledPaper>
      </Container>
    )
  }

  if (showError) {
    return (
      <Container style={{ width: "90%", maxWidth: 900 }}>
        <StyledPaper>
          <div>Error: {errorMessage}</div>
        </StyledPaper>
      </Container>
    )
  }

  if (showTrusted) {
    return (
      <Container style={{ width: "90%", maxWidth: 900 }}>
        <StyledPaper>
          <div>Redirecting trusted application....</div>
        </StyledPaper>
      </Container>
    )
  }

  return (
    <Container style={{ width: "90%", maxWidth: 900 }}>
      <StyledPaper>
        <p>{t("authConsent")}</p>
        <AllowButton onClick={() => getDecision(true)}>Allow</AllowButton>
        <DenyButton onClick={() => getDecision(false)}>Deny</DenyButton>
      </StyledPaper>
    </Container>
  )
}

export default Authorization
