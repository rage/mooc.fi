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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { FormikProps } from "formik"
import { FormValues } from "./types"
import ConfirmationDialog from "../ConfirmationDialog"

const isProduction = process.env.NODE_ENV === "production"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      spacing: "4",
    },
    paper: {
      padding: "1em",
    },
    status: (props: { [key: string]: any }) => ({
      color: props.error ? "#FF0000" : "default",
    }),
  }),
)

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

  const classes = useStyles({ error: status ? status.error : null })
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(
    false,
  )

  return (
    <Container maxWidth="md" className={classes.form}>
      <Paper elevation={1} className={classes.paper}>
        <ConfirmationDialog
          title="You have unsaved changes"
          content="Are you sure you want to leave without saving?"
          acceptText="Yes"
          rejectText="No"
          onAccept={(e: React.MouseEvent) => {
            setCancelConfirmationVisible(false)
            onCancel()
          }}
          onReject={() => setCancelConfirmationVisible(false)}
          open={cancelConfirmationVisible}
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
          <p className={classes.status}>
            {status.error ? "Error submitting: " : null}
            <b>{status.message}</b>
          </p>
        ) : null}
      </Paper>
    </Container>
  )
}

export default FormWrapper
