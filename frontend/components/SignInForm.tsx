import React, { useState, useEffect, useRef } from "react"
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
} from "@material-ui/core"

import { signIn } from "/lib/authentication"
import NextI18Next from "/i18n"
import { createStyles, makeStyles } from "@material-ui/core/styles"

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
    setTimeout(inputFieldSetter, 10)
    setTimeout(inputFieldSetter, 1000)
    setTimeout(inputFieldSetter, 5000)
  }, [])

  const classes = useStyles()

  return (
    <form className={classes.form}>
      <NextI18Next.Trans i18nKey="common:loginDetails" />
      <FormControl required fullWidth error={error}>
        <InputLabel htmlFor="email">
          <NextI18Next.Trans i18nKey="common:username" />
        </InputLabel>
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
        <InputLabel htmlFor="password">
          <NextI18Next.Trans i18nKey="common:password" />
        </InputLabel>
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
        <FormHelperText error={error}>
          {error && <NextI18Next.Trans i18nKey="common:error" />}
        </FormHelperText>
      </FormControl>

      <Button
        className={classes.submit}
        type="submit"
        fullWidth
        variant="contained"
        color="secondary"
        disabled={email.trim() === "" || password.trim() === ""}
        onClick={async e => {
          e.preventDefault()
          try {
            await signIn({ email, password })
          } catch (e) {
            setError(true)
            setTimeout(() => {
              setError(false)
            }, 5000)
          }
        }}
      >
        <NextI18Next.Trans i18nKey="common:login" />
      </Button>
      <NextI18Next.Link href="https://tmc.mooc.fi/password_reset_keys/new">
        <a href="https://tmc.mooc.fi/password_reset_keys/new">
          <NextI18Next.Trans i18nKey="common:forgottenpw" />
        </a>
      </NextI18Next.Link>
    </form>
  )
}

export default SignIn
