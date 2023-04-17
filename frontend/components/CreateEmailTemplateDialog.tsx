import { useMemo, useState } from "react"

import { omit } from "lodash"
import Router from "next/router"

import { useApolloClient, useQuery } from "@apollo/client"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material"

import CustomSnackbar from "/components/CustomSnackbar"
import Spinner from "/components/Spinner"
import notEmpty from "/util/notEmpty"

import {
  AddEmailTemplateDocument,
  CourseCoreFieldsFragment,
  CourseUpsertArg,
  EmailTemplateEditorCoursesDocument,
  UpdateCourseDocument,
} from "/graphql/generated"

interface CreateEmailTemplateDialogParams {
  course?: CourseCoreFieldsFragment
  buttonText: string
  type?: string
}

const CreateEmailTemplateDialog = ({
  course,
  buttonText,
  type = "completion",
}: CreateEmailTemplateDialogParams) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [templateType, setTemplateType] = useState(type)
  const [selectedCourse, setSelectedCourse] =
    useState<CourseCoreFieldsFragment | null>(null)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false)
  const { loading, error, data } = useQuery(EmailTemplateEditorCoursesDocument)
  const client = useApolloClient()

  const handleDialogClickOpen = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const courseOptions = useMemo(() => {
    if (!data) {
      return []
    }

    let courseData = data.courses?.filter(notEmpty) ?? []

    if (templateType === "completion") {
      courseData = courseData.filter((c) => c.completion_email == null)
    }

    return courseData.map((c, i) => (
      <option key={c.id} value={i}>
        {c?.name}
      </option>
    ))
  }, [templateType, data])

  const handleCreate = async () => {
    try {
      const { data } = await client.mutate({
        mutation: AddEmailTemplateDocument,
        variables: {
          name: nameInput,
          template_type: templateType,
          triggered_automatically_by_course_id:
            templateType === "threshold" ? selectedCourse?.id : null,
        },
      })

      const updateableCourse = course ?? selectedCourse

      if (updateableCourse) {
        const connectVariables = {} as CourseUpsertArg

        if (templateType === "completion") {
          connectVariables.completion_email_id = data?.addEmailTemplate?.id
        }
        if (templateType === "course-stats") {
          connectVariables.course_stats_email_id = data?.addEmailTemplate?.id
        }

        await client.mutate({
          mutation: UpdateCourseDocument,
          variables: {
            course: {
              // - already has slug and can't have both
              // - let's also strip the queried emails as we don't want to update the other one if the one is updated/created
              ...omit(updateableCourse, [
                "__typename",
                "id",
                "completion_email",
                "course_stats_email",
                "created_at",
                "updated_at",
              ]),
              ...connectVariables,
            },
          },
        })
      }

      const url = "/email-templates/" + data?.addEmailTemplate?.id
      Router.push(url)
    } catch {
      setIsErrorSnackbarOpen(true)
    }
  }

  if (loading) {
    return <Spinner />
  }
  //TODO fix error messages
  if (error || !data) {
    return <p>Error has occurred</p>
  }

  return (
    <div>
      <Button color="primary" onClick={handleDialogClickOpen}>
        {buttonText}
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
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          {/* If we have a course, we are coming from the course dashboard */}
          {!course && (
            <>
              <InputLabel htmlFor="select">Template type</InputLabel>
              <NativeSelect
                onChange={(e) => {
                  e.preventDefault()
                  setTemplateType(e.target.value)
                }}
                id="selectType"
                value={templateType}
              >
                <option value="completion">Completion e-mail</option>
                <option value="threshold">Threshold e-mail</option>
                <option value="course-stats">Course stats e-mail</option>
              </NativeSelect>
              <br />
              <br />
              <InputLabel htmlFor="selectCourse">For course</InputLabel>
              <NativeSelect
                onChange={(e) => {
                  e.preventDefault()
                  setSelectedCourse(
                    data?.courses?.[Number(e.target.value)] ?? null,
                  )
                }}
                id="selectCourse"
                defaultValue="Select course"
              >
                <option value="Select course">Select...</option>
                {courseOptions}
              </NativeSelect>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCreate()} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={isErrorSnackbarOpen}
        setOpen={setIsErrorSnackbarOpen}
        type="error"
        message="Error in creating a new EmailTemplate, see console"
      />
    </div>
  )
}

export default CreateEmailTemplateDialog
