import { CircularProgress, TextField } from "@material-ui/core"
import React, { useEffect } from "react"
import { StyledPaper, Row, Form, Header, StyledTypography } from "./common"
import SignUpTranslations from "/translations/sign-up"
import { useTranslator } from "/util/useTranslator"
import { FormSubmitButton as SubmitButton } from "/components/Buttons/FormSubmitButton"
import { Controller, useForm } from "react-hook-form"

interface EditDetailsFromProps {
  firstName: string
  lastName: string
  email: string
  upstreamId?: number
}

interface FormState {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  submitting: boolean
}

const EditDetailsForm = ({
  firstName,
  lastName,
  email,
  upstreamId,
}: EditDetailsFromProps) => {
  const t = useTranslator(SignUpTranslations)

  const hasTmc = (upstreamId ?? -1) > 0

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { isSubmitting, errors, isValid },
  } = useForm<FormState>({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
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
    trigger()
  }
  console.log(errors)
  return (
    <StyledPaper>
      <Header component="h1" variant="h4" gutterBottom={true} align="center">
        {t("signupHYHaka")}
      </Header>
      <Form onSubmit={handleSubmit(onSubmit)} onBlur={validate}>
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
            defaultValue={firstName}
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
            defaultValue={lastName}
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
        {!hasTmc && (
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
    </StyledPaper>
  )
}

export default EditDetailsForm // TODO: prevent people from wandering here
