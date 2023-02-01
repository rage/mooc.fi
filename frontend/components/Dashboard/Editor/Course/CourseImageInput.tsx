import React, {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useMemo,
  useState,
} from "react"

import { Field, FieldInputProps, useFormikContext } from "formik"
import { useRouter } from "next/router"

import { Button, FormControl } from "@mui/material"

import { FormFieldGroup } from "./CourseEditForm"
import { CourseFormValues } from "./types"
import { FormSubtitle } from "/components/Dashboard/Editor/common"
import ImportPhotoDialog from "/components/Dashboard/Editor/Course/ImportPhotoDialog"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import CoursesTranslations from "/translations/courses"
import { addDomain } from "/util/imageUtils"
import { useTranslator } from "/util/useTranslator"

import { EditorCourseOtherCoursesFieldsFragment } from "/graphql/generated"

interface ImageInputProps {
  courses?: EditorCourseOtherCoursesFieldsFragment[] | null
}

const ImageDropzoneField = (props: FieldInputProps<CourseFormValues>) => {
  const { values, setFieldValue, initialValues } =
    useFormikContext<CourseFormValues>()

  const resetPhoto = useCallback(() => {
    // setFieldValue("photo", null)
    setFieldValue("new_photo", null)
    setFieldValue("thumbnail", "")

    if (initialValues?.photo) {
      setFieldValue("delete_photo", true)
    }
  }, [setFieldValue, initialValues])

  const onImageLoad = useCallback(
    (value: any) => setFieldValue("thumbnail", value),
    [setFieldValue],
  )
  const onImageAccepted = useCallback(
    (value: any) => setFieldValue("new_photo", value),
    [setFieldValue],
  )

  const onClose = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      resetPhoto()
    },
    [resetPhoto],
  )

  const imagePreviewFile = useMemo(() => addDomain(values.thumbnail), [values])

  return (
    <ImageDropzoneInput
      {...props}
      onImageLoad={onImageLoad}
      onImageAccepted={onImageAccepted}
    >
      <ImagePreview file={imagePreviewFile} onClose={onClose} />
    </ImageDropzoneInput>
  )
}
const CourseImageInput = ({ courses }: ImageInputProps) => {
  const { values } = useFormikContext<CourseFormValues>()
  const { locale = "fi" } = useRouter()
  const t = useTranslator(CoursesTranslations)
  const [dialogOpen, setDialogOpen] = useState(false)

  const coursesWithPhotos = useMemo(
    () =>
      courses
        ?.filter(
          (course) =>
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
        .sort((a, b) => (a.name < b.name ? -1 : 1)) ?? [],
    [courses, locale, values],
  )

  const onImportPhotoClick = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      setDialogOpen(true)
    },
    [setDialogOpen],
  )

  const onImportPhotoDialogClose = useCallback(
    () => setDialogOpen(false),
    [setDialogOpen],
  )

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
          as={ImageDropzoneField}
          //errors={errors.new_photo}
          fullWidth
        />
        <Button
          color="primary"
          style={{ marginTop: "0.5rem" }}
          onClick={onImportPhotoClick}
        >
          {t("importPhotoButton")}
        </Button>
        <ImportPhotoDialog
          open={dialogOpen}
          onClose={onImportPhotoDialogClose}
          courses={coursesWithPhotos}
        />
      </FormControl>
    </FormFieldGroup>
  )
}

export default CourseImageInput
