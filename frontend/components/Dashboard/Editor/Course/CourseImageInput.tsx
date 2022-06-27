import { MouseEvent as ReactMouseEvent, useCallback, useState } from "react"

import { Button, FormControl } from "@mui/material"
import { Field, FieldInputProps, useFormikContext } from "formik"
import { useRouter } from "next/router"

import { FormFieldGroup } from "./CourseEditForm"
import { CourseFormValues } from "./types"
import { FormSubtitle } from "/components/Dashboard/Editor/common"
import ImportPhotoDialog from "/components/Dashboard/Editor/Course/ImportPhotoDialog"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { CourseEditorCourses_courses } from "/static/types/generated/CourseEditorCourses"
import CoursesTranslations from "/translations/courses"
import { addDomain } from "/util/imageUtils"
import { useTranslator } from "/util/useTranslator"

interface ImageInputProps {
  courses: CourseEditorCourses_courses[] | undefined
}

const CourseImageInput = (props: ImageInputProps) => {
  const { values, setFieldValue, initialValues } =
    useFormikContext<CourseFormValues>()
  const { courses } = props
  const { locale = "fi" } = useRouter()
  const t = useTranslator(CoursesTranslations)
  const [dialogOpen, setDialogOpen] = useState(false)

  const coursesWithPhotos =
    courses
      ?.filter(
        (course: CourseEditorCourses_courses) =>
          course.slug !== values.slug && !!course?.photo?.compressed,
      )
      .map((course) => {
        const translation = (course.course_translations?.filter(
          (t) => t.language === locale,
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
          as={(props: FieldInputProps<CourseFormValues>) => (
            <ImageDropzoneInput
              {...props}
              onImageLoad={(value: any) => setFieldValue("thumbnail", value)}
              onImageAccepted={(value) => setFieldValue("new_photo", value)}
            >
              <ImagePreview
                file={addDomain(values.thumbnail)}
                onClose={(
                  e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
                ): void => {
                  e.stopPropagation()
                  e.nativeEvent.stopImmediatePropagation()
                  resetPhoto()
                }}
              />
            </ImageDropzoneInput>
          )}
          //errors={errors.new_photo}
          fullWidth
        />
        <Button
          color="primary"
          style={{ marginTop: "0.5rem" }}
          onClick={(e) => {
            e.preventDefault()
            setDialogOpen(true)
          }}
        >
          {t("importPhotoButton")}
        </Button>
        <ImportPhotoDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          courses={coursesWithPhotos}
        />
      </FormControl>
    </FormFieldGroup>
  )
}

export default CourseImageInput
