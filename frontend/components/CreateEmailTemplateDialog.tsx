import { useId, useMemo, useState } from "react"

import Router from "next/router"
import { omit } from "remeda"

import { useMutation, useQuery } from "@apollo/client"
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

import ErrorMessage from "./ErrorMessage"
import CustomSnackbar from "/components/CustomSnackbar"
import Spinner from "/components/Spinner"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import EmailTemplatesTranslations from "/translations/emailTemplates"
import { EmailTemplateType } from "/types/emailTemplates"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  AddEmailTemplateDocument,
  CourseDashboardCourseFieldsFragment,
  CourseUpsertArg,
  EmailTemplateEditorCoursesDocument,
  UpdateCourseDocument,
  UpdateOrganizationEmailTemplateDocument,
} from "/graphql/generated"

interface CreateEmailTemplateDialogProps {
  course?: CourseDashboardCourseFieldsFragment
  buttonText: string
  organization?: any // TODO: type, actually query this somewhere
  type?: EmailTemplateType
}

const CreateEmailTemplateDialog = ({
  course,
  organization,
  buttonText,
  type = "completion",
}: CreateEmailTemplateDialogProps) => {
  const [selectedCourse, setSelectedCourse] =
    useState<CourseDashboardCourseFieldsFragment | null>(null)
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false)
  const { loading, error, data } = useQuery(EmailTemplateEditorCoursesDocument)
  const t = useTranslator(EmailTemplatesTranslations)
  const dialogTitleId = useId()

  const [openDialog, setOpenDialog] = useState(false)
  const [nameInput, setNameInput] = useState("")
  const [templateType, setTemplateType] = useState(type)

  const [addEmailTemplateMutation] = useMutation(AddEmailTemplateDocument)
  const [updateCourseMutation] = useMutation(UpdateCourseDocument)
  const [updateOrganizationEmailTemplateMutation] = useMutation(
    UpdateOrganizationEmailTemplateDocument,
  )

  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"

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

    let courseData = data.courses?.filter(isDefinedAndNotEmpty) ?? []

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
      const { data: addEmailTemplateData } = await addEmailTemplateMutation({
        variables: {
          name: nameInput,
          template_type: templateType,
          triggered_automatically_by_course_id:
            templateType === "threshold" ? selectedCourse?.id : null,
        },
      })

      const updateableCourse = course ?? selectedCourse

      if (updateableCourse && templateType !== "join-organization") {
        const connectVariables = {} as CourseUpsertArg

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
                "created_at",
                "updated_at",
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
            email_template_id: addEmailTemplateData!.addEmailTemplate!.id,
          },
        })
      }

      const url =
        `${baseUrl}/email-templates/` +
        addEmailTemplateData!.addEmailTemplate!.id
      Router.push(url)
    } catch {
      setIsErrorSnackbarOpen(true)
    }
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    console.log(error)
    return <ErrorMessage />
  }

  if (!data) {
    return <div>{t("templateNotFound")}</div>
  }

  return (
    <div>
      <Button color="primary" onClick={handleDialogClickOpen}>
        {buttonText}
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby={dialogTitleId}
      >
        <DialogTitle id={dialogTitleId}>{t("create")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("createDialogDescription")}</DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label={t("name")}
            type="text"
            fullWidth
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          {/* If we have a course, we are coming from the course dashboard */}
          {!course && !organization && (
            <>
              <InputLabel htmlFor="select">{t("templateType")}</InputLabel>
              <NativeSelect
                onChange={(e) => {
                  e.preventDefault()
                  setTemplateType(e.target.value as EmailTemplateType)
                }}
                id="selectType"
                value={templateType}
              >
                <option value="completion">{t("typeCompletion")}</option>
                <option value="threshold">{t("typeThreshold")}</option>
                <option value="course-stats">{t("typeCourseStats")}</option>
                <option value="join-organization">
                  {t("typeJoinOrganization")}
                </option>
              </NativeSelect>
              {templateType !== "join-organization" && (
                <>
                  <br />
                  <br />
                  <InputLabel htmlFor="selectCourse">
                    {t("forCourse")}
                  </InputLabel>
                  <NativeSelect
                    onChange={(e) => {
                      e.preventDefault()
                      setSelectedCourse(
                        data.courses
                          ?.filter(isDefinedAndNotEmpty)
                          .find((c) => c.id === e.target.value) ?? null,
                      )
                    }}
                    id="selectCourse"
                    defaultValue="Select course"
                  >
                    <option value="Select course">{t("selectCourse")}</option>
                    {courseOptions}
                  </NativeSelect>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            {t("cancel")}
          </Button>
          <Button onClick={() => handleCreate()} color="primary">
            {t("create")}
          </Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
        open={isErrorSnackbarOpen}
        setOpen={setIsErrorSnackbarOpen}
        type="error"
        message={t("createError")}
      />
    </div>
  )
}

export default CreateEmailTemplateDialog
