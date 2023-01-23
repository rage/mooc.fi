import { useCallback, useMemo, useState } from "react"

import { useRouter } from "next/router"
import { useFormContext } from "react-hook-form"

import { Button } from "@mui/material"

import ImportPhotoDialog from "./ImportPhotoDialog"
import {
  FormFieldGroup,
  FormSubtitle,
} from "/components/Dashboard/Editor2/Common"
import {
  ControlledHiddenField,
  ControlledImageInput,
} from "/components/Dashboard/Editor2/Common/Fields"
import { CourseFormValues } from "/components/Dashboard/Editor2/Course/types"
import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
import CoursesTranslations from "/translations/courses"
import { addDomain } from "/util/imageUtils"
import { useTranslator } from "/util/useTranslator"

import { EditorCourseOtherCoursesFieldsFragment } from "/graphql/generated"

interface CourseImageFormProps {
  courses?: EditorCourseOtherCoursesFieldsFragment[]
}

export default function CourseImageForm({ courses }: CourseImageFormProps) {
  const { locale = "fi" } = useRouter()
  const t = useTranslator(CoursesTranslations)
  const { watch, setValue } = useFormContext()
  const { initialValues } = useEditorContext<CourseFormValues>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const onImageLoad = useCallback(
    (value: string | ArrayBuffer | null) => setValue("thumbnail", value),
    [setValue],
  )
  const onImageAccepted = useCallback(
    (value: File) => setValue("new_photo", value, { shouldDirty: true }),
    [setValue],
  )

  const onClose = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      setValue("thumbnail", "")
      setValue("new_photo", null, { shouldDirty: true })

      if (initialValues.photo) {
        // TODO: not dirtying the form
        setValue("delete_photo", true)
      }
    },
    [setValue, initialValues],
  )

  const slug = watch("slug")

  const coursesWithPhotos = useMemo(
    () =>
      courses
        ?.filter(
          (course) => course.slug !== slug && !!course?.photo?.compressed,
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
    [courses, t, locale, slug],
  )

  const onImportPhotoDialogOpen = useCallback(
    () => setDialogOpen(true),
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
      <ControlledHiddenField
        name="thumbnail"
        defaultValue={watch("thumbnail") ?? ""}
      />
      <ControlledHiddenField name="photo" defaultValue={watch("photo") ?? ""} />
      <ControlledHiddenField
        name="delete_photo"
        defaultValue={watch("delete_photo") ?? false}
      />
      <ControlledImageInput
        name="new_photo"
        label={t("courseNewPhoto")}
        onImageLoad={onImageLoad}
        onImageAccepted={onImageAccepted}
        onClose={onClose}
        thumbnail={addDomain(watch("thumbnail"))}
      />
      <Button
        color="primary"
        style={{ marginTop: "0.5rem", width: "100%" }}
        onClick={onImportPhotoDialogOpen}
      >
        {t("importPhotoButton")}
      </Button>
      <ImportPhotoDialog
        open={dialogOpen}
        onClose={onImportPhotoDialogClose}
        courses={coursesWithPhotos}
      />
    </FormFieldGroup>
  )
}
