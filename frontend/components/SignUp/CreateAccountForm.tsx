import { Component } from "react"
import { TextField, CircularProgress } from "@material-ui/core"
import { createAccount } from "/lib/account"
import { signIn as authenticate } from "/lib/authentication"
import SignUpTranslations from "/translations/sign-up"
import LangLink from "/components/LangLink"
import { FormSubmitButton as SubmitButton } from "/components/Buttons/FormSubmitButton"
import getTranslator from "/translations"
import capitalizeFirstLetter from "/util/capitalizeFirstLetter"
import LanguageContext from "/contexts/LanguageContext"
import {
  StyledPaper,
  Row,
  Form,
  Header,
  InfoBox,
  StyledTypography,
} from "./common"

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
}

export interface CreateAccountFormProps {
  onComplete: Function
}

const getSignUpTranslator = getTranslator(SignUpTranslations)

class CreateAccountForm extends Component<CreateAccountFormProps> {
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

      this.props.onComplete()
    } catch (error: any) {
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
      } catch {
        this.setState({
          error: JSON.stringify(error.response.data.message),
          submitting: false,
        })
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
  }

  render() {
    const t = getSignUpTranslator(this.context.language)

    return (
      <StyledPaper>
        <Header component="h1" variant="h4" gutterBottom={true} align="center">
          {t("signupTitle")}
        </Header>
        <Form onChange={this.validate}>
          <StyledTypography component="p" paragraph>
            {t("formInfoText")}
          </StyledTypography>
          <Row>
            <TextField
              variant="outlined"
              type="email"
              name="email"
              autoComplete="lolled"
              label={t("formLabelEmail")}
              placeholder={t("formLabelEmail")}
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
              placeholder={t("formLabelFirstName")}
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
              placeholder={t("formLabelLastName")}
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
              placeholder={t("formLabelPassword")}
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
              placeholder={t("formLabelPasswordAgain")}
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
          <LangLink href={`/sign-in`} passHref>
            {/*LangLink passes href*/}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <a>{t("signIn")}</a>
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
