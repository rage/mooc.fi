import { useEffect, useRef, useState } from "react"
import { useContext } from "react"

import styled from "@emotion/styled"
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Link,
} from "@mui/material"

import { FormSubmitButton as SubmitButton } from "/components/Buttons/FormSubmitButton"
import LoginStateContext from "/contexts/LoginStateContext"
import { isSignedIn, signIn } from "/lib/authentication"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const StyledForm = styled.form`
  padding: 1em;
`

function SignIn() {
  const { logInOrOut } = useContext(LoginStateContext)
  const t = useTranslator(CommonTranslations)

  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)

  const emailFieldRef = useRef<HTMLInputElement>(null)
  const passwordFieldRef = useRef<HTMLInputElement>(null)

  let errorTimeout: NodeJS.Timeout | null = null

  useEffect(() => {
    const inputFieldSetter = () => {
      if (password == "" && passwordFieldRef?.current?.value) {
        setPassword(passwordFieldRef.current.value)
      }
      if (email == "" && emailFieldRef?.current?.value) {
        setEmail(emailFieldRef.current.value)
      }
    }
    const timeouts = [
      setTimeout(inputFieldSetter, 10),
      setTimeout(inputFieldSetter, 1000),
      setTimeout(inputFieldSetter, 5000),
    ]

    return () => timeouts.forEach((t) => clearTimeout(t))
  }, [])

  return (
    <StyledForm>
      <FormControl required fullWidth error={error}>
        <InputLabel htmlFor="email">{t("username")}</InputLabel>
        <Input
          id="email"
          name="email"
          inputRef={emailFieldRef}
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
          inputRef={passwordFieldRef}
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
            await signIn({ email, password, shallow: false })
            try {
              await logInOrOut()
            } catch (e) {
              console.error("Login in or out failed")
            }

            if (errorTimeout) {
              clearTimeout(errorTimeout)
            }
          } catch (error) {
            console.error("Login failed due to this error: ", error)
            setError(true)
            if (isSignedIn(undefined as any)) {
              console.error("Logging in was successful but it crashed")
            }
            errorTimeout = setTimeout(() => {
              setError(false)
              if (errorTimeout) {
                clearTimeout(errorTimeout)
              }
            }, 5000)
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
    </StyledForm>
  )
}

export default SignIn
