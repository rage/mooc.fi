import { CircularProgress, TextField } from "@material-ui/core"
import React, { useEffect, useReducer, useState } from "react"
import {
  StyledPaper,
  Row,
  Form,
  Header,
  InfoBox,
  StyledTypography,
} from "./common"
import SignUpTranslations from "/translations/sign-up"
import { useTranslator } from "/util/useTranslator"
import { FormSubmitButton as SubmitButton } from "/components/Buttons/FormSubmitButton"
import { Controller, useForm } from "react-hook-form"
import LangLink from "/components/LangLink"
import { ControlledTextField } from "/components/Dashboard/Editor2/Common/Fields"

interface EditDetailsFromProps {
  first_name: string
  last_name: string
  email: string
  has_tmc?: boolean
}

interface FormState {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  submitting: boolean
}

interface FormAction {
  type: string
  field: string
  payload: any
}

const reducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "EDIT":
      return {
        ...state,
        [action.field]: action.payload,
      }
  }

  return state
}
const EditDetailsForm = ({
  first_name,
  last_name,
  email,
  has_tmc,
}: EditDetailsFromProps) => {
  const t = useTranslator(SignUpTranslations)

  /*const [state, dispatch] = useReducer(reducer, { first_name, last_name, email, submitting: false })

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    dispatch({ type: "EDIT", field: e.target.name, payload: e.target.value })
  }*/

  const {
    control,
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    getValues,
    formState: {
      isSubmitting,
      isSubmitted,
      isSubmitSuccessful,
      errors,
      isValid,
    },
  } = useForm<FormState>({
    defaultValues: {
      first_name,
      last_name,
      email,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  })
  useEffect(() => {
    trigger()
  }, [])
  const onSubmit = (values: any) => console.log(values)

  const validate = () => {
    const values = getValues()
    /*if (values.email) {
      if (values.email.indexOf("@") === - 1) {
        setError("email", { type: "atSign", message: t("emailNoAt") })
      } else if (values.email.indexOf(".") === -1) {
        setError("email", { type: "dot", message: t("emailNoPoint")})
      } else {
        clearErrors("email")
      }
    }*/
    trigger()
  }
  console.log(errors)
  return (
    <StyledPaper>
      <Header component="h1" variant="h4" gutterBottom={true} align="center">
        {t("signupHYHaka")}
      </Header>
      <Form onSubmit={handleSubmit(onSubmit)} onChange={validate}>
        <StyledTypography component="p" paragraph>
          {t("formInfoHYHakaRegister")}
        </StyledTypography>
        <Row>
          <Controller
            name="email"
            control={control}
            defaultValue={email}
            rules={{
              required: t("required"),
              validate: {
                noAt: (value) => value.indexOf("@") > -1 || t("emailNoAt"),
                dot: (value) => value.indexOf(".") > -1 || t("emailNoPoint"),
              },
            }}
            render={({
              field: { onChange, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                variant="outlined"
                label={t("formLabelEmail")}
                type="email"
                autoComplete="lolled"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                inputRef={ref}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name="first_name"
            control={control}
            defaultValue={first_name}
            rules={{ required: t("required") }}
            render={({
              field: { onChange, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                variant="outlined"
                type="text"
                label={t("formLabelFirstName")}
                autoComplete="lolled"
                fullWidth
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                inputRef={ref}
              />
            )}
          />
        </Row>
        <Row>
          <Controller
            name="last_name"
            control={control}
            defaultValue={last_name}
            rules={{ required: t("required") }}
            render={({
              field: { onChange, value, ref },
              fieldState: { error },
            }) => (
              <TextField
                variant="outlined"
                type="text"
                label={t("formLabelLastName")}
                autoComplete="lolled"
                fullWidth
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                inputRef={ref}
              />
            )}
          />
        </Row>
        {!has_tmc && (
          <>
            <StyledTypography
              component="p"
              paragraph
              dangerouslySetInnerHTML={{
                __html: t("formInfoNoTMC", { email }),
              }}
            />
            <Row>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: t("required") }}
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    type="password"
                    label={t("formLabelPassword")}
                    autoComplete="lolled"
                    fullWidth
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    inputRef={ref}
                  />
                )}
              />
            </Row>
            <Row>
              <Controller
                name="password_confirmation"
                control={control}
                defaultValue=""
                rules={{
                  required: t("required"),
                  validate: (value) =>
                    getValues("password") === value || t("passwordNoMatch"),
                }}
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <TextField
                    variant="outlined"
                    type="password"
                    label={t("formLabelPasswordAgain")}
                    autoComplete="lolled"
                    fullWidth
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    helperText={error ? error.message : null}
                    inputRef={ref}
                  />
                )}
              />
            </Row>
          </>
        )}

        <Row>
          <SubmitButton
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isValid}
            variant="contained"
            color="secondary"
            fullWidth
            type="submit"
          >
            {isSubmitting ? <CircularProgress size={20} /> : t("signupTitle")}
          </SubmitButton>
        </Row>
      </Form>

      <Row>
        <LangLink href={`/sign-in`}>
          <a>{t("signIn")}</a>
        </LangLink>
      </Row>

      {!isValid && (
        <InfoBox>
          <b>
            {" "}
            {t("error")} {"error"}
          </b>
        </InfoBox>
      )}
    </StyledPaper>
  )
}

export default EditDetailsForm // TODO: prevent people from wandering here
