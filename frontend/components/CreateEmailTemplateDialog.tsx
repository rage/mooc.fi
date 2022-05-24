import { useState } from "react"

import CustomSnackbar from "/components/CustomSnackbar"
import Spinner from "/components/Spinner"
import { UpdateCourseMutation } from "/graphql/mutations/courses"
import { AddEmailTemplateMutation } from "/graphql/mutations/email-templates"
import { CourseDetailsFromSlugQuery_course as CourseDetailsData } from "/static/types/generated/CourseDetailsFromSlugQuery"
import { omit } from "lodash"
import Router from "next/router"

import { gql, OperationVariables, useMutation, useQuery } from "@apollo/client"
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

export const UpdateOrganizationEmailTemplateMutation = gql`
  mutation updateOrganizationEmailTemplate($id: ID!, $email_template_id: ID!) {
    updateOrganization(id: $id, email_template_id: $email_template_id) {
      id
      email_template {
        id
      }
    }
  }
`

interface CreateEmailTemplateDialogParams {
  course?: CourseDetailsData
  organization?: any
  buttonText: string
  type?: EmailTemplateType
}

type EmailTemplateType =
  | "completion"
  | "course-stats"
  | "threshold"
  | "join-organization"

const CreateEmailTemplateDialog = ({
  course,
  organization,
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

  const { loading, error, data } = useQuery<{ courses: CourseDetailsData[] }>(
    AllCoursesDetails,
  )
  const [addEmailTemplate, {}] = useMutation(AddEmailTemplateMutation)
  const [updateCourseMutation, {}] = useMutation(UpdateCourseMutation)
  const [updateOrganizationEmailTemplateMutation, {}] = useMutation(
    UpdateOrganizationEmailTemplateMutation,
  )

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
      const { data: addEmailTemplateData } = await addEmailTemplate({
        variables: {
          name: nameInput,
          type: templateType,
          triggered_automatically_by_course_id:
            templateType === "threshold" ? selectedCourse?.id : null,
        },
      })

      console.log("data", addEmailTemplateData)

      const updateableCourse = course ?? selectedCourse

      if (updateableCourse && templateType !== "join-organization") {
        const connectVariables = {} as OperationVariables

        if (templateType === "completion") {
          connectVariables.completion_email_id =
            addEmailTemplateData?.addEmailTemplate?.id
        }
        if (templateType === "course-stats") {
          connectVariables.course_stats_email_id =
            addEmailTemplateData?.addEmailTemplate?.id
        }

        await updateCourseMutation({
          variables: {
            course: {
              // - already has slug and can't have both
              // - let's also strip the queried emails as we don't want to update the other one if the one is updated/created
              ...omit(updateableCourse, [
                "__typename",
                "id",
                "completion_email",
                "course_stats_email",
              ]),
              ...connectVariables,
            },
          },
        })
      }

      if (organization && templateType === "join-organization") {
        await updateOrganizationEmailTemplateMutation({
          variables: {
            id: organization.id,
            email_template_id: addEmailTemplateData?.addEmailTemplate?.id,
          },
        })
      }

      const url =
        "/email-templates/" + addEmailTemplateData?.addEmailTemplate?.id
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
          {/* If we have a course, we are coming from the course dashboard */}
          {!course && !organization && (
            <>
              <InputLabel htmlFor="select">Template type</InputLabel>
              <NativeSelect
                onChange={(e) => {
                  e.preventDefault()
                  setTemplateType(e.target.value as EmailTemplateType)
                }}
                id="selectType"
                value={templateType}
              >
                <option value="completion">Completion e-mail</option>
                <option value="threshold">Threshold e-mail</option>
                <option value="course-stats">Course stats e-mail</option>
                <option value="join-organization">
                  Join organization e-mail
                </option>
              </NativeSelect>
              {templateType !== "join-organization" && (
                <>
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
