import React, { useContext, useState, useCallback } from "react"
import { FormFieldGroup } from "./CourseEditForm"
import { FormControl, Button } from "@material-ui/core"
import { Field, FieldProps } from "formik"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { CourseFormValues } from "./types"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { addDomain } from "/util/imageUtils"
import { FormSubtitle } from "./CourseEditForm"
import ImportPhotoDialog from "/components/Dashboard/Editor/Course/ImportPhotoDialog"
import { initialValues } from "./form-validation"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"

interface ImageInputProps {
  errors: any
  values: any
  setFieldValue: any
  courses: CourseEditorCourses_courses[] | undefined
}
const CourseImageInput = (props: ImageInputProps) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)
  const { errors, values, setFieldValue, courses } = props
  const [dialogOpen, setDialogOpen] = useState(false)

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

  const resetPhoto = useCallback(() => {
    // setFieldValue("photo", null)
    setFieldValue("new_photo", null)
    setFieldValue("thumbnail", "")

    if (initialValues?.photo) {
      setFieldValue("delete_photo", true)
    }
  }, [])

  return (
    <FormFieldGroup>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("coursePhoto")}
      </FormSubtitle>
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
    </FormFieldGroup>
  )
}

export default CourseImageInput
