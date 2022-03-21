import { useState } from "react"

import CustomSnackbar from "/components/CustomSnackbar"
import Spinner from "/components/Spinner"
import { UpdateCourseMutation } from "/graphql/mutations/courses"
import { AddEmailTemplateMutation } from "/graphql/mutations/email-templates"
import { AddEmailTemplate } from "/static/types/generated/AddEmailTemplate"
import { CourseDetailsFromSlugQuery_course as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlugQuery"
import { updateCourse } from "/static/types/generated/updateCourse"
import omit from "lodash/omit"
import Router from "next/router"

import { gql, useApolloClient, useQuery } from "@apollo/client"
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

export const AllCoursesDetails = gql`
  query AllCoursesDetails {
    courses {
      id
      slug
      name
      teacher_in_charge_name
      teacher_in_charge_email
      start_date
      completion_email {
        name
        id
      }
      course_stats_email {
        id
      }
    }
  }
`

interface CreateEmailTemplateDialogParams {
  course?: CourseDetailsData
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
  const [selectedCourse, setSelectedCourse] = useState<
    CourseDetailsData | undefined
  >(undefined)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false)
  const { loading, error, data } =
    useQuery<{ courses: CourseDetailsData[] }>(AllCoursesDetails)
  const client = useApolloClient()

  if (loading) {
    return <Spinner />
  }
  //TODO fix error messages
  if (error || !data) {
    return <p>Error has occurred</p>
  }

  const handleDialogClickOpen = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
  }

  const courseOptions =
    templateType === "completion"
      ? data.courses
          .filter((c) => c?.completion_email === null)
          .map((c, i) => {
            return (
              <option key={i} value={i}>
                {c?.name}
              </option>
            )
          })
      : data.courses.map((c, i) => {
          return (
            <option key={i} value={i}>
              {c?.name}
            </option>
          )
        })

  const handleCreate = async () => {
    try {
      const { data } = await client.mutate<AddEmailTemplate>({
        mutation: AddEmailTemplateMutation,
        variables: {
          name: nameInput,
          template_type: templateType,
          triggered_automatically_by_course_id:
            templateType === "threshold" ? selectedCourse?.id : null,
        },
      })
      if ((course || selectedCourse) && templateType === "completion") {
        await client.mutate<updateCourse>({
          mutation: UpdateCourseMutation,
          variables: {
            course: {
              ...omit(course ?? selectedCourse, "__typename", "id"),
              completion_email: data?.addEmailTemplate?.id,
            },
          },
        })
      }
      if ((course || selectedCourse) && templateType === "course-stats") {
        await client.mutate<updateCourse>({
          mutation: UpdateCourseMutation,
          variables: {
            course: {
              ...omit(course ?? selectedCourse, "__typename", "id"),
              course_stats_email: data?.addEmailTemplate?.id,
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
          {/* If we end up from course edit dashboard here, we have course and we know it
          is a completion type. Could be refactored to own Dialog */}
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
                  setSelectedCourse(data.courses[Number(e.target.value)])
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
