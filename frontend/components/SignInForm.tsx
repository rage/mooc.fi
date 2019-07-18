import React, { useState } from "react"
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText,
} from "@material-ui/core"

import { signIn } from "../lib/authentication"
import NextI18Next from "../i18n"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
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
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
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
