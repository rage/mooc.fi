import React, { useState } from "react"
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
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(
    false,
  )
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(
    false,
  )

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1}>
        <ConfirmationDialog
          title="You have unsaved changes"
          content="Are you sure you want to leave without saving?"
          acceptText="Yes"
          rejectText="No"
          onAccept={() => {
            setCancelConfirmationVisible(false)
            onCancel()
          }}
          onReject={() => setCancelConfirmationVisible(false)}
          show={cancelConfirmationVisible}
        />
        <ConfirmationDialog
          title="About to delete"
          content="Are you sure you want to delete?"
          acceptText="Yes"
          rejectText="No"
          onAccept={() => {
            setDeleteConfirmationVisible(false)
            onDelete(values)
          }}
          onReject={() => setDeleteConfirmationVisible(false)}
          show={deleteConfirmationVisible}
        />
        {renderForm(props)}
        <br />
        <Grid container direction="row">
          <Grid item xs={3}>
            {!isProduction && values.id ? (
              <Tooltip title="Check this to show delete button">
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
                Delete
              </StyledButton>
            ) : null}
          </Grid>
          <Grid container item justify="flex-end" xs={9}>
            <StyledButton
              color="secondary"
              style={{ marginRight: "6px" }}
              disabled={isSubmitting}
              onClick={() =>
                dirty ? setCancelConfirmationVisible(true) : onCancel()
              }
            >
              Cancel
            </StyledButton>
            <StyledButton
              color="primary"
              disabled={
                !dirty || Object.keys(errors).length > 0 || isSubmitting
              }
              onClick={submitForm}
            >
              {isSubmitting ? <CircularProgress size={20} /> : "Save"}
            </StyledButton>
          </Grid>
        </Grid>
        {status && status.message ? (
          <Status error={status.error}>
            {status.error ? "Error submitting: " : null}
            <b>{status.message}</b>
          </Status>
        ) : null}
      </FormBackground>
    </Container>
  )
}

export default FormWrapper
