import React from "react"
import {
  TextField,
  Typography,
  Paper,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link,
} from "@material-ui/core"
import { createAccount } from "../lib/account"
import { signIn as authenticate } from "../lib/authentication"
import LanguageContext from "/contexes/LanguageContext"
import getSignUpTranslator from "/translations/sign-up"
import LangLink from "/components/LangLink"
import styled from "styled-components"
import { FormSubmitButton as SubmitButton } from "/components/Buttons/FormSubmitButton"
import { gql, ApolloClient } from "apollo-boost"

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  margin-top: 2em;
  margin-bottom: 2em;
`
const Row = styled.div`
  margin-bottom: 1.5rem;
`
const Form = styled.form`
  width: 100%;
`
const Header = styled(Typography)<any>`
  margin: 1em;
`

const InfoBox = styled.div`
  margin-bottom: 2rem;
`

const StyledTypography = styled(Typography)<any>`
  margin-bottom: 2rem;
`

interface state {
  email?: string
  password?: string
  password_confirmation?: string
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
  research?: string
}

const updateResearchConsentMutation = gql`
  mutation updateResearchConsent($value: Boolean!) {
    updateResearchConsent(value: $value) {
      id
    }
  }
`

export function capitalizeFirstLetter(string: String) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export interface CreateAccountFormProps {
  onComplete: Function
  apollo: ApolloClient<object>
}

class CreateAccountForm extends React.Component<CreateAccountFormProps> {
  static contextType = LanguageContext
  constructor(props: CreateAccountFormProps) {
    super(props)
  }

  componentDidMount() {
    const clearFields = () => {
      this.setState({
        email: "",
        password: "",
        password_confirmation: "",
        first_name: "",
        last_name: "",
      })
    }
    setTimeout(clearFields, 200)
    setTimeout(clearFields, 500)
    setTimeout(clearFields, 1000)
  }

  onClick = async (e: any) => {
    e.preventDefault()
    const t = getSignUpTranslator(this.context.language)
    this.setState({ submitting: true, triedSubmitting: true })
    if (!this.validate()) {
      this.setState({ canSubmit: false, submitting: false })
      return
    }
    try {
      await createAccount({
        email: this.state.email,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        password: this.state.password,
        password_confirmation: this.state.password_confirmation,
      })

      await authenticate({
        email: this.state.email || "",
        password: this.state.password || "",
        redirect: false,
      })

      await this.props.apollo.mutate({
        mutation: updateResearchConsentMutation,
        variables: {
          value: this.state.research === "1",
        },
      })

      // TODO/FIXME: above mutation will update the consent,
      // but also a GQL error because it tries to create a new user
      // with same upstream_id!

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
              newMessage = t("emailTaken")
            }
            message = `${message} ${newMessage}`
          })
        })

        if (message === "") {
          message = t("commonProblem") + JSON.stringify(error)
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
    const t = getSignUpTranslator(this.context.language)
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
      research,
    } = this.state
    if (email && validateEmail) {
      if (email.indexOf("@") === -1) {
        newState.error += t("emailNoAt")
        newState.errorObj.email = true
      }
      if (email && email.indexOf(".") === -1) {
        newState.error += t("emailNoPoint")
        newState.errorObj.email = true
      }
    }

    if (typeof research == "undefined") {
      newState.error += t("researchNotAnswered")
      newState.errorObj.research = true
    }

    if (password && password_confirmation && validatePassword) {
      if (password !== password_confirmation) {
        newState.error += t("passwordNoMatch")
        newState.errorObj.password = true
        newState.errorObj.password_confirmation = true
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
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    submitting: false,
    error: false,
    errorObj: {},
    validatePassword: false,
    validateEmail: false,
    canSubmit: true,
    triedSubmitting: true,
    research: undefined,
  }

  render() {
    const t = getSignUpTranslator(this.context.language)
    return (
      <StyledPaper>
        <Header component="h1" variant="h4" gutterBottom={true} align="center">
          {t("signupTitle")}
        </Header>
        <StyledTypography component="p" paragraph>
          {t("formInfoText")}
        </StyledTypography>
        <Form onChange={this.validate}>
          <Row>
            <TextField
              variant="outlined"
              type="email"
              name="email"
              autoComplete="lolled"
              label={t("formLabelEmail")}
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
              label={t("formLabelFirstName")}
              name="first_name"
              autoComplete="lolled"
              fullWidth
              value={this.state.first_name}
              onChange={this.handleInput}
            />
          </Row>
          <Row>
            <TextField
              variant="outlined"
              type="text"
              label={t("formLabelLastName")}
              name="last_name"
              autoComplete="lolled"
              fullWidth
              value={this.state.last_name}
              onChange={this.handleInput}
            />
          </Row>
          <Row>
            <TextField
              variant="outlined"
              type={this.state.showPassword ? "text" : "password"}
              label={t("formLabelPassword")}
              name="password"
              autoComplete="lolled"
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
              label={t("formLabelPasswordAgain")}
              name="password_confirmation"
              autoComplete="lolled"
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

          <h2>{t("researchTitle")}</h2>

          <p>{t("research1")}</p>

          <ol>
            <li>{t("research2")}</li>
            <li>{t("research3")}</li>
            <li>{t("research4")}</li>
          </ol>

          <p>
            {t("research5")}
            <Link
              href="https://dl.acm.org/citation.cfm?id=2858798"
              target="_blank"
              rel="noopener noreferrer"
            >
              Educational Data Mining and Learning Analytics in Programming:
              Literature Review and Case Studies
            </Link>
            .
          </p>

          <p>{t("research6")}</p>

          <p>{t("research7")}</p>

          <Row>
            <>
              <RadioGroup
                aria-label={t("researchAgree")}
                name="research"
                value={this.state.research}
                onChange={this.handleInput}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label={t("researchYes")}
                />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label={t("researchNo")}
                />
              </RadioGroup>
            </>
          </Row>

          <Row>
            <SubmitButton
              onClick={this.onClick}
              disabled={this.state.submitting || !this.state.canSubmit}
              variant="contained"
              color="secondary"
              fullWidth
              type="submit"
            >
              {this.state.submitting ? (
                <CircularProgress size={20} />
              ) : (
                t("signupTitle")
              )}
            </SubmitButton>
          </Row>
        </Form>

        <Row>
          <LangLink
            href="/[lng]/sign-in"
            as={`/${this.context.language}/sign-in`}
          >
            <a href="/[lng]/sign-in">{t("signIn")}</a>
          </LangLink>
        </Row>
        {this.state.error && (
          <InfoBox>
            <b>
              {" "}
              {t("error")} {this.state.error}
            </b>
          </InfoBox>
        )}
      </StyledPaper>
    )
  }
}

export default CreateAccountForm
