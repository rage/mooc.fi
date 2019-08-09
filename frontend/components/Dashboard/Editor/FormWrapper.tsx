import React, { useState } from "react"
import {
  Container,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Checkbox as MUICheckbox,
  Tooltip,
} from "@material-ui/core"
import { FormikProps } from "formik"
import { FormValues } from "./types"
import ConfirmationDialog from "../ConfirmationDialog"
import styled from "styled-components"

const isProduction = process.env.NODE_ENV === "production"

const FormContainer = styled(Container)`
  spacing: 4;
`

const FormBackground = styled(Paper)`
  padding: 1em;
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

  return (
    <FormContainer maxWidth="md">
      <FormBackground elevation={1}>
        <ConfirmationDialog
          title="You have unsaved changes"
          content="Are you sure you want to leave without saving?"
          acceptText="Yes"
          rejectText="No"
          // @ts-ignore
          onAccept={(e: React.MouseEvent) => {
            setCancelConfirmationVisible(false)
            onCancel()
          }}
          onReject={() => setCancelConfirmationVisible(false)}
          show={cancelConfirmationVisible}
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
              <Button
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                onClick={() => onDelete(values)}
              >
                Delete
              </Button>
            ) : null}
          </Grid>
          <Grid container item justify="flex-end" xs={9}>
            <Button
              color="secondary"
              style={{ marginRight: "6px" }}
              disabled={isSubmitting}
              onClick={() =>
                dirty ? setCancelConfirmationVisible(true) : onCancel()
              }
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={
                !dirty || Object.keys(errors).length > 0 || isSubmitting
              }
              onClick={submitForm}
            >
              {isSubmitting ? <CircularProgress size={20} /> : "Save"}
            </Button>
          </Grid>
        </Grid>
        {status && status.message ? (
          <Status error={status!.error}>
            {status.error ? "Error submitting: " : null}
            <b>{status.message}</b>
          </Status>
        ) : null}
      </FormBackground>
    </FormContainer>
  )
}

export default FormWrapper
