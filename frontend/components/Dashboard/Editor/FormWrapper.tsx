import React, { useState, useContext } from "react"
import {
  Container,
  Paper,
  Grid,
  CircularProgress,
  Checkbox as MUICheckbox,
  Tooltip,
} from "@material-ui/core"
import { FormikProps } from "formik"
import { FormValues } from "./types"
import styled from "styled-components"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import getCommonTranslator from "/translations/common"
import LanguageContext from "/contexes/LanguageContext"
import { useConfirm } from "material-ui-confirm"
// import Router from "next/router"

// TODO: show delete to course owner
const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)`
  padding: 2em;
`

const Status = styled.p<any>`
  color: ${(props: any) => (props.error ? "#FF0000" : "default")};
`

interface FormWrapperProps<T> extends FormikProps<T> {
  onCancel: () => void
  onDelete: (values: T) => void
  renderForm: (props: any) => React.ReactNode
}

function FormWrapper<T extends FormValues>(props: FormWrapperProps<T>) {
  const {
    submitForm,
    errors,
    dirty,
    isSubmitting,
    values,
    status,
    onCancel,
    onDelete,
    renderForm,
  } = props
  const { language } = useContext(LanguageContext)
  const t = getCommonTranslator(language)
  const confirm = useConfirm()

  const [deleteVisible, setDeleteVisible] = useState(false)

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#8C64AC" }}>
        {renderForm(props)}
        <br />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <StyledButton
              color="primary"
              disabled={
                !dirty || isSubmitting
                //!dirty || Object.keys(errors).length > 0 || isSubmitting
              }
              onClick={() => {
                if (Object.keys(errors).length) {
                  const [key, value] = Object.entries(errors)[0]

                  let anchorLink = key
                  if (Array.isArray(value)) {
                    const firstIndex = parseInt(Object.keys(value)[0])
                    anchorLink = `${key}[${firstIndex}].${
                      Object.keys(value[firstIndex])[0]
                    }`
                  }
                  window.location.replace(
                    window.location.href.split("#")[0] + `#${anchorLink}`,
                  )
                  // Router.replace(`#${Object.keys(errors)[0]}`)
                } else {
                  submitForm()
                }
              }}
              style={{ width: "100%" }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : t("save")}
            </StyledButton>
          </Grid>
          <Grid item xs={4}>
            <StyledButton
              color="secondary"
              style={{ width: "100%" }}
              disabled={isSubmitting}
              variant="contained"
              onClick={() =>
                dirty
                  ? confirm({
                      title: t("confirmationUnsavedChanges"),
                      description: t("confirmationLeaveWithoutSaving"),
                      confirmationText: t("confirmationYes"),
                      cancellationText: t("confirmationNo"),
                    }).then(onCancel)
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
                disabled={isSubmitting}
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

export default FormWrapper
