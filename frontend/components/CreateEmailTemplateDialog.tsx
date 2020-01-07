import { ApolloConsumer } from "@apollo/react-hooks"
import * as React from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@material-ui/core"
import { AddEmailTemplateMutation } from "/graphql/mutations/email-templates"
import { AddEmailTemplate } from "/static/types/generated/AddEmailTemplate"
import Router from "next/router"
import { useContext } from "react"
import LanguageContext from "/contexes/LanguageContext"
import CustomSnackbar from "/components/CustomSnackbar"
import { updateCourse } from "/static/types/generated/updateCourse"
import { UpdateCourseMutation } from "/graphql/mutations/courses"

interface CreateEmailTemplateDialogParams {
  course?: string
  buttonText: string
}
const CreateEmailTemplateDialog = (props: CreateEmailTemplateDialogParams) => {
  const [openDialog, setOpenDialog] = React.useState(false)
  const [nameInput, setNameInput] = React.useState("")
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = React.useState(false)
  const { language } = useContext(LanguageContext)
  const handleDialogClickOpen = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  return (
    <div>
      <Button color="primary" onClick={handleDialogClickOpen}>
        {props.buttonText}
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Name your new Email Template. This will create new Email Template
            and you will be redirected to editing page.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <ApolloConsumer>
            {client => (
              <Button
                onClick={async () => {
                  try {
                    const { data } = await client.mutate<AddEmailTemplate>({
                      mutation: AddEmailTemplateMutation,
                      variables: { name: nameInput },
                    })
                    if (props.course) {
                      await client.mutate<updateCourse>({
                        mutation: UpdateCourseMutation,
                        variables: {
                          course: {
                            slug: props.course,
                            completion_email: data?.addEmailTemplate.id,
                          },
                        },
                      })
                    }
                    const url =
                      "/" +
                      language +
                      "/email-templates/" +
                      data?.addEmailTemplate.id
                    Router.push(url)
                  } catch {
                    setIsErrorSnackbarOpen(true)
                  }
                }}
                color="primary"
              >
                Create
              </Button>
            )}
          </ApolloConsumer>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={isErrorSnackbarOpen}
        setOpen={setIsErrorSnackbarOpen}
        variant="error"
        message="Error in creating a new EmailTemplate"
      />
    </div>
  )
}

export default CreateEmailTemplateDialog
