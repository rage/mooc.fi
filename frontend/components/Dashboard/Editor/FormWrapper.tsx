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
import ConfirmationDialog from "/components/Dashboard/ConfirmationDialog"
import styled from "styled-components"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import getCommonTranslator from "/translations/common"
import LanguageContext from "/contexes/LanguageContext"

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
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(
    false,
  )
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(
    false,
  )

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#C0D7D5" }}>
        <ConfirmationDialog
          title={t("confirmationUnsavedChanges")}
          content={t("confirmationLeaveWithoutSaving")}
          acceptText={t("confirmationYes")}
          rejectText={t("confirmationNo")}
          onAccept={() => {
            setCancelConfirmationVisible(false)
            onCancel()
          }}
          onReject={() => setCancelConfirmationVisible(false)}
          show={cancelConfirmationVisible}
        />
        <ConfirmationDialog
          title={t("confirmationAboutToDelete")}
          content={t("confirmationDelete")}
          acceptText={t("confirmationYes")}
          rejectText={t("confirmationNo")}
          onAccept={() => {
            setDeleteConfirmationVisible(false)
            onDelete(values)
          }}
          onReject={() => setDeleteConfirmationVisible(false)}
          show={deleteConfirmationVisible}
        />
        {renderForm(props)}
        <br />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <StyledButton
              color="primary"
              disabled={
                !dirty || Object.keys(errors).length > 0 || isSubmitting
              }
              onClick={submitForm}
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
                dirty ? setCancelConfirmationVisible(true) : onCancel()
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
                onClick={() => setDeleteConfirmationVisible(true)}
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
