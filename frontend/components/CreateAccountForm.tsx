import React from "react"
import { TextField, Button, Link } from "@material-ui/core"
import { createAccount } from "../lib/create-account"
import { signIn as authenticate } from "../lib/authentication"
import NextI18next from "../i18n"

import styled from "styled-components"

const Row = styled.div`
  margin-bottom: 1.5rem;
`

const Form = styled.form``

const InfoBox = styled.div`
  margin-bottom: 2rem;
`

const FormContainer = styled.div`
  height: 100%;
  margin-top: 2rem;
`
interface state {
  email?: string | undefined
  password?: string | undefined
  password_confirmation?: string | undefined
  submitting?: boolean
  error?: any
  errorObj?: any
  validatePassword?: boolean
  validateEmail?: boolean
  canSubmit?: boolean
  triedSubmitting?: boolean
  showPassword?: boolean
  first_name?: string
  last_name?: string
}

export function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export interface CreateAccountFormProps {
  onComplete: Function
  t: any
}

class CreateAccountForm extends React.Component<CreateAccountFormProps> {
  constructor(props: CreateAccountFormProps) {
    super(props)
  }
  onClick = async (e: any) => {
    e.preventDefault()
    this.setState({ submitting: true, triedSubmitting: true })
    if (!this.validate()) {
      this.setState({ canSubmit: false, submitting: false })
      return
    }
    try {
      const res = await createAccount({
        email: this.state.email,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        password: this.state.password,
        password_confirmation: this.state.password_confirmation,
      })
      console.log("Created an account:", JSON.stringify(res))
      await authenticate({
        email: this.state.email || "",
        password: this.state.password || "",
        redirect: false,
      })

      this.props.onComplete()
    } catch (error) {
      try {
        let message = ""
        Object.entries(error).forEach((o: any) => {
          const key = o[0]
          const value = o[1]
          value.forEach((msg: any) => {
            let newMessage = capitalizeFirstLetter(
              `${key.replace(/_/g, " ")} ${msg}.`,
            )
            if (newMessage === "Email has already been taken.") {
              newMessage =
                "Sähköpostiosoitteesi on jo käytössä. Oletko tehnyt aikaisemmin mooc.fi:n kursseja?"
            }
            message = `${message} ${newMessage}`
          })
        })

        if (message === "") {
          message =
            "Ongelma tunnuksen luonnissa. Virhe oli: " + JSON.stringify(error)
        }
        this.setState({ error: message, submitting: false, errorObj: error })
      } catch (_error2) {
        this.setState({ error: JSON.stringify(error), submitting: false })
      }

      this.setState({ submitting: false })
    }
  }

  handleInput = (e: any) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: value }, () => {
      this.validate()
    })
  }

  validate = () => {
    let newState: state = {
      error: "",
      errorObj: {},
    }
    const {
      email,
      password,
      password_confirmation,
      validatePassword,
      validateEmail,
      triedSubmitting,
    } = this.state
    if (email && validateEmail) {
      if (email.indexOf("@") === -1) {
        newState.error += "Sähköpostiosoitessa ei ole '@'-merkkiä. "
        newState.errorObj.email = "Sähköpostiosoitessa ei ole '@'-merkkiä. "
      }
      if (email && email.indexOf(".") === -1) {
        newState.error += "Sähköpostiosoitessa ei ole '.'-merkkiä. "
        newState.errorObj.email = "Sähköpostiosoitessa ei ole '.'-merkkiä. "
      }
    }

    if (password && password_confirmation && validatePassword) {
      if (password !== password_confirmation) {
        newState.error += "Salasana ja salasana uudestaan eivät olleet samoja. "
        newState.errorObj.password =
          "Salasana ja salasana uudestaan eivät olleet samoja."
        newState.errorObj.password_confirmation =
          "Salasana ja salasana uudestaan eivät olleet samoja."
      }
    }

    if (newState.error === "") {
      newState.error = false
      newState.canSubmit = true
    }

    if (!email || !password || !password_confirmation) {
      if (triedSubmitting) {
        newState.canSubmit = false
      }
      return false
    }
    this.setState(newState)
    return !newState.error
  }

  state: state = {
    email: undefined,
    password: undefined,
    password_confirmation: undefined,
    submitting: false,
    error: false,
    errorObj: {},
    validatePassword: false,
    validateEmail: false,
    canSubmit: true,
    triedSubmitting: true,
  }

  render() {
    return (
      <FormContainer>
        <h1>Luo käyttäjätunnus</h1>
        <Form onChange={this.validate}>
          <Row>
            <TextField
              variant="outlined"
              type="email"
              name="email"
              autoComplete="email"
              label="Sähköpostiosoite"
              error={this.state.errorObj.email}
              fullWidth
              value={this.state.email}
              onChange={this.handleInput}
              onBlur={() => {
                this.setState({ validateEmail: true }, () => {
                  this.validate()
                })
              }}
            />
          </Row>
          <Row>
            <TextField
              variant="outlined"
              type="text"
              label="Etunimi"
              name="first_name"
              fullWidth
              value={this.state.first_name}
              onChange={this.handleInput}
            />
          </Row>
          <Row>
            <TextField
              variant="outlined"
              type="text"
              label="Sukunimi"
              name="last_name"
              fullWidth
              value={this.state.last_name}
              onChange={this.handleInput}
            />
          </Row>
          <Row>
            <TextField
              variant="outlined"
              type={this.state.showPassword ? "text" : "password"}
              label="Salasana"
              name="password"
              error={this.state.errorObj.password}
              fullWidth
              value={this.state.password}
              onChange={this.handleInput}
            />
          </Row>
          <Row>
            <TextField
              variant="outlined"
              type={this.state.showPassword ? "text" : "password"}
              label="Salasana uudestaan"
              name="password_confirmation"
              error={this.state.errorObj.password_confirmation}
              fullWidth
              value={this.state.password_confirmation}
              onChange={this.handleInput}
              onBlur={() => {
                this.setState({ validatePassword: true }, () => {
                  this.validate()
                })
              }}
            />
          </Row>

          <Row>
            <Button
              onClick={this.onClick}
              disabled={this.state.submitting || !this.state.canSubmit}
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
            >
              Luo käyttäjätunnus
            </Button>
          </Row>
        </Form>

        <Row>
          <Link href="/sign-in">
            Onko sinulla jo käyttäjätunnus? Kirjaudu sisään
          </Link>
        </Row>
        {this.state.error && (
          <InfoBox>
            <b>Virhe: {this.state.error}</b>
          </InfoBox>
        )}
      </FormContainer>
    )
  }
}

export default NextI18next.withTranslation("sign-up")(CreateAccountForm)
