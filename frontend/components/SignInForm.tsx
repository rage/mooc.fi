import React, { useState, useEffect, useRef } from "react"
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
  Link,
} from "@material-ui/core"

import { signIn } from "../lib/authentication"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import LanguageContext from "/contexes/LanguageContext"
import LoginStateContext from "/contexes/LoginStateContext"
import getCommonTranslator from "/translations/common"
import { useContext } from "react"

const useStyles = makeStyles(() =>
  createStyles({
    form: {
      widht: "100%",
      marginTop: "1em",
    },
    submit: {
      marginTop: "1em",
    },
  }),
)

function SignIn() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)

  const emailFieldRef = useRef<HTMLInputElement>(null)
  const passwordFieldRef = useRef<HTMLInputElement>(null)

  let errorTimeout: number | null = null

  useEffect(() => {
    const inputFieldSetter = () => {
      if (
        password == "" &&
        passwordFieldRef &&
        passwordFieldRef.current &&
        passwordFieldRef.current.value
      ) {
        setPassword(passwordFieldRef.current.value)
      }
      if (
        email == "" &&
        emailFieldRef &&
        emailFieldRef.current &&
        emailFieldRef.current.value
      ) {
        setEmail(emailFieldRef.current.value)
      }
    }

    const timeouts = [
      setTimeout(inputFieldSetter, 10),
      setTimeout(inputFieldSetter, 1000),
      setTimeout(inputFieldSetter, 5000),
    ]

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [])

  const classes = useStyles()
  const lng = useContext(LanguageContext)
  const t = getCommonTranslator(lng.language)
  return (
    <LoginStateContext.Consumer>
      {({ logInOrOut }) => (
        <form className={classes.form}>
          {t("loginDetails")}
          <FormControl required fullWidth error={error}>
            <InputLabel htmlFor="email">{t("username")}</InputLabel>
            <Input
              id="email"
              name="email"
              inputRef={emailFieldRef}
              autoComplete="nope"
              onChange={o => {
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
              onChange={o => {
                setPassword(o.target.value)
                setError(false)
              }}
            />
            <FormHelperText error={error}>{error && t("error")}</FormHelperText>
          </FormControl>

          <Button
            className={classes.submit}
            type="submit"
            data-testid="login-button"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={email.trim() === "" || password.trim() === ""}
            onClick={async e => {
              e.preventDefault()
              try {
                await signIn({ email, password }).then(logInOrOut)
                if (errorTimeout) {
                  clearTimeout(errorTimeout)
                }
              } catch (e) {
                setError(true)
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
          </Button>
          <Link href="https://tmc.mooc.fi/password_reset_keys/new">
            <a href="https://tmc.mooc.fi/password_reset_keys/new">
              {t("forgottenpw")}
            </a>
          </Link>
        </form>
      )}
    </LoginStateContext.Consumer>
  )
}

export default SignIn
