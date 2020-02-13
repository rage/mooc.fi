import React, { useCallback, useContext, useState } from "react"
import {
  InputLabel,
  FormControl,
  FormControlLabel,
  MenuItem,
  Grid,
  Typography,
  List,
  ListItem,
  Button,
} from "@material-ui/core"
import {
  Formik,
  Field,
  Form,
  FieldProps,
  FormikActions,
  FormikProps,
  yupToFormErrors,
} from "formik"
import { Checkbox } from "formik-material-ui"
import * as Yup from "yup"
import CourseTranslationEditForm from "./CourseTranslationEditForm"
import CourseVariantEditForm from "./CourseVariantEditForm"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { statuses as statusesT } from "./form-validation"
import { CourseFormValues } from "./types"
import styled from "styled-components"
import { addDomain } from "/util/imageUtils"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import {
  StyledTextField,
  OutlinedFormControl,
  OutlinedInputLabel,
  OutlinedFormGroup,
} from "/components/Dashboard/Editor/common"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import ImportPhotoDialog from "/components/Dashboard/Editor/Course/ImportPhotoDialog"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`
const FormSubtitle = styled(Typography)`
  padding: 20px 0px 20px 0px;
  margin-bottom: 1rem;
  font-size: 2em;
`

interface RenderFormProps {
  initialValues?: CourseFormValues
  courses?: CourseEditorCourses_courses[]
  studyModules?: CourseEditorStudyModules_study_modules[]
}

const renderForm = ({
  initialValues,
  courses,
  studyModules,
}: RenderFormProps) => ({
  errors,
  values,
  isSubmitting,
  setFieldValue,
}: // setStatus
Pick<
  FormikProps<CourseFormValues>,
  | "errors"
  | "values"
  | "isSubmitting"
  | "setFieldValue"
  | "initialValues"
  | "setStatus"
>) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const statuses = statusesT(t)
  const [dialogOpen, setDialogOpen] = useState(false)

  const resetPhoto = useCallback(() => {
    // setFieldValue("photo", null)
    setFieldValue("new_photo", initialValues?.photo ? "<DELETE>" : null)
    setFieldValue("thumbnail", "")
  }, [])

  const coursesWithPhotos =
    courses
      ?.filter(
        (course: CourseEditorCourses_courses) =>
          course.slug !== values.slug && !!course?.photo?.compressed,
      )
      .map(course => {
        const translation = (course.course_translations?.filter(
          t => t.language === language,
        ) ?? [])[0]

        return {
          ...course,
          name: translation?.name ?? course.name,
        }
      })
      .sort((a, b) => (a.name < b.name ? -1 : 1)) ?? []

  return (
    <Form>
      <FormSubtitle variant="h6">{t("courseDetails")}</FormSubtitle>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            name="name"
            type="text"
            label={t("courseName")}
            error={errors.name}
            fullWidth
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Field
            name="new_slug"
            type="text"
            label={t("courseSlug")}
            error={errors.new_slug}
            fullWidth
            variant="outlined"
            autoComplete="off"
            component={StyledTextField}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Field
            name="ects"
            type="text"
            label={t("courseECTS")}
            errors={errors.ects}
            fullWidth
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl>
            <Field
              name="status"
              type="text"
              label={t("courseStatus")}
              select
              component={StyledTextField}
              errors={errors.status}
              variant="outlined"
              fullWidth
            >
              {statuses.map((option: { value: string; label: string }) => (
                <MenuItem key={`status-${option.value}`} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Field
            name="order"
            type="number"
            label={t("courseOrder")}
            error={errors.order}
            fullWidth
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
          />
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Field
            name="study_module_order"
            type="number"
            label={t("courseModuleOrder")}
            error={errors.study_module_order}
            fullWidth
            autoComplete="off"
            variant="outlined"
            component={StyledTextField}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justify="space-between"
        spacing={2}
      ></Grid>
      <Grid container direction="row" justify="space-between" spacing={2}>
        <Grid
          container
          item
          xs={12}
          sm={6}
          direction="column"
          justify="space-between"
        >
          <OutlinedFormControl variant="outlined">
            <OutlinedInputLabel shrink>
              {t("courseProperties")}
            </OutlinedInputLabel>
            <OutlinedFormGroup>
              <FormControlLabel
                control={
                  <Field
                    label={t("coursePromote")}
                    type="checkbox"
                    name="promote"
                    value={values.promote}
                    component={Checkbox}
                  />
                }
                label={t("coursePromote")}
              />
              <FormControlLabel
                control={
                  <Field
                    label={t("courseStartPoint")}
                    type="checkbox"
                    name="start_point"
                    value={values.start_point}
                    component={Checkbox}
                  />
                }
                label={t("courseStartPoint")}
              />
              <FormControlLabel
                control={
                  <Field
                    label={t("courseModuleStartPoint")}
                    type="checkbox"
                    name="study_module_start_point"
                    value={values.study_module_start_point}
                    component={Checkbox}
                  />
                }
                label={t("courseModuleStartPoint")}
              />
              <FormControlLabel
                control={
                  <Field
                    label={t("courseHidden")}
                    type="checkbox"
                    name="hidden"
                    value={values.hidden}
                    component={Checkbox}
                  />
                }
                label={t("courseHidden")}
              />
            </OutlinedFormGroup>
          </OutlinedFormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <OutlinedFormControl>
            <OutlinedInputLabel shrink>{t("courseModules")}</OutlinedInputLabel>
            <OutlinedFormGroup>
              <ModuleList>
                {studyModules?.map(
                  (module: CourseEditorStudyModules_study_modules) => (
                    <ModuleListItem key={module.id}>
                      <FormControlLabel
                        control={
                          <Field
                            label={module.name}
                            type="checkbox"
                            name={`study_modules[${module.id}]`}
                            value={(values.study_modules || {})[module.id]}
                            component={Checkbox}
                          />
                        }
                        label={module.name}
                      />
                    </ModuleListItem>
                  ),
                )}
              </ModuleList>
            </OutlinedFormGroup>
          </OutlinedFormControl>
        </Grid>
      </Grid>
      <CourseVariantEditForm
        values={values.course_variants}
        errors={errors.course_variants}
        isSubmitting={isSubmitting}
      />
      <InputLabel htmlFor="new_photo" shrink>
        {t("coursePhoto")}
      </InputLabel>
      <FormControl>
        <Field name="thumbnail" type="hidden" />
        <Field
          name="new_photo"
          type="file"
          label={t("courseNewPhoto")}
          errors={errors.new_photo}
          fullWidth
          render={({ field, form }: FieldProps<CourseFormValues>) => (
            <ImageDropzoneInput
              field={field}
              form={form}
              onImageLoad={(value: any) => setFieldValue("thumbnail", value)}
            >
              <ImagePreview
                file={addDomain(values.thumbnail)}
                onClose={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                ): void => {
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  resetPhoto()
                }}
              />
            </ImageDropzoneInput>
          )}
        />
        <Button
          color="primary"
          style={{ marginTop: "0.5rem" }}
          onClick={() => setDialogOpen(true)}
        >
          {t("importPhotoButton")}
        </Button>
        <ImportPhotoDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          courses={coursesWithPhotos}
          values={values}
          setFieldValue={setFieldValue}
        />
      </FormControl>
      <FormSubtitle variant="h6">{t("courseTranslations")}</FormSubtitle>
      <CourseTranslationEditForm
        values={values.course_translations}
        errors={errors.course_translations}
        isSubmitting={isSubmitting}
      />
    </Form>
  )
}

const CourseEditForm = React.memo(
  ({
    course,
    studyModules,
    courses,
    validationSchema,
    onSubmit,
    onCancel,
    onDelete,
  }: {
    course: CourseFormValues
    studyModules?: CourseEditorStudyModules_study_modules[]
    courses?: CourseEditorCourses_courses[]
    validationSchema: Yup.ObjectSchema
    onSubmit: (
      values: CourseFormValues,
      formikActions: FormikActions<CourseFormValues>,
    ) => void
    onCancel: () => void
    onDelete: (values: CourseFormValues) => void
  }) => {
    const validate = useCallback(
      async (values: CourseFormValues) =>
        validationSchema
          .validate(values, { abortEarly: false, context: { values } })
          .catch(err => {
            throw yupToFormErrors(err)
          }),
      [],
    )

    return (
      <Formik
        initialValues={course}
        validate={validate}
        onSubmit={onSubmit}
        render={formikProps => (
          <FormWrapper<CourseFormValues>
            {...formikProps}
            renderForm={renderForm({
              initialValues: course,
              courses,
              studyModules,
            })}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        )}
      />
    )
  },
)

export default CourseEditForm
