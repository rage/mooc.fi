import React, { useEffect, useState, useContext, useCallback } from "react"
import {
  Container,
  Paper,
  Grid,
  CircularProgress,
  Checkbox as MUICheckbox,
  Tooltip,
} from "@material-ui/core"
import { FormikErrors, FormikTouched, useFormikContext } from "formik"
import { FormValues } from "./types"
import styled from "styled-components"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import getCommonTranslator from "/translations/common"
import LanguageContext from "/contexes/LanguageContext"
import AnchorContext from "/contexes/AnchorContext"
import { useConfirm } from "material-ui-confirm"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import flattenKeys from "/util/flattenKeys"

// TODO: show delete to course owner
const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)`
  padding: 2em;
`

const Status = styled.p<any>`
  color: ${(props: any) => (props.error ? "#FF0000" : "default")};
`

interface FormWrapperProps<T> {
  onCancel: () => void
  onDelete: (values: T) => void
  renderForm: (props: any) => React.ReactNode
}

const FormWrapper = <T extends FormValues>(props: FormWrapperProps<T>) => {
  const {
    submitForm,
    errors,
    dirty,
    isSubmitting,
    values,
    status,
    setTouched,
  } = useFormikContext<T>()
  const { onCancel, onDelete, renderForm } = props
  const { language } = useContext(LanguageContext)
  const t = getCommonTranslator(language)
  const { anchors } = useContext(AnchorContext)
  const confirm = useConfirm()

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const errorsToTouched = useCallback(
    (i: FormikErrors<T>): FormikTouched<T> =>
      Object.assign(
        {},
        ...Object.keys(flattenKeys(i)).map((k) => ({ [k]: true })),
      ),
    [],
  )

  const onSubmit = useCallback(() => {
    if (Object.keys(errors).length) {
      setTouched(errorsToTouched(errors) as FormikTouched<T>)

      const [key, value] = Object.entries(flattenKeys(errors)).sort(
        (a, b) => anchors[a[0]] - anchors[b[0]],
      )[0]

      let anchorLink = key
      if (Array.isArray(value)) {
        const firstIndex = parseInt(Object.keys(value)[0])
        anchorLink = `${key}[${firstIndex}].${
          Object.keys(value[firstIndex])[0]
        }`
      }

      const element = document.getElementById(anchorLink)
      element?.scrollIntoView()
    } else {
      setSubmitted(true)
      submitForm()
    }
  }, [errors])

  useEffect(() => {
    if (status?.message && status?.error) {
      setSubmitted(false)
    }
  }, [status])

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#8C64AC" }}>
        {renderForm(props)}
        <br />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <StyledButton
              color="primary"
              disabled={!dirty || isSubmitting || submitted}
              onClick={onSubmit}
              style={{ width: "100%" }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : t("save")}
            </StyledButton>
          </Grid>
          <Grid item xs={4}>
            <StyledButton
              color="secondary"
              style={{ width: "100%" }}
              disabled={isSubmitting || submitted}
              variant="contained"
              onClick={() =>
                dirty
                  ? confirm({
                      title: t("confirmationUnsavedChanges"),
                      description: t("confirmationLeaveWithoutSaving"),
                      confirmationText: t("confirmationYes"),
                      cancellationText: t("confirmationNo"),
                    })
                      .then(onCancel)
                      .catch(() => {})
                  : onCancel()
              }
            >
              {t("cancel")}
            </StyledButton>
          </Grid>
          <Grid item xs={2}>
            {!isProduction && values.id ? (
              <Tooltip title={t("showDelete")}>
                <MUICheckbox
                  checked={deleteVisible}
                  onChange={() => setDeleteVisible(!deleteVisible)}
                />
              </Tooltip>
            ) : null}
            {deleteVisible && values.id ? (
              <StyledButton
                variant="contained"
                color="secondary"
                disabled={isSubmitting || submitted}
                onClick={() =>
                  confirm({
                    title: t("confirmationAboutToDelete"),
                    description: t("confirmationDelete"),
                    confirmationText: t("confirmationYes"),
                    cancellationText: t("confirmationNo"),
                  }).then(() => onDelete(values))
                }
              >
                {t("delete")}
              </StyledButton>
            ) : null}
          </Grid>
        </Grid>
        {status?.message ? (
          <Status error={status.error}>
            {status.error ? t("submittingError") : null}
            <b>{status.message}</b>
          </Status>
        ) : null}
      </FormBackground>
    </Container>
  )
}

// need to pass type through
const WrappedFormWrapper: <T>(
  props: FormWrapperProps<T>,
) => JSX.Element = withEnumeratingAnchors(FormWrapper)

export default WrappedFormWrapper
