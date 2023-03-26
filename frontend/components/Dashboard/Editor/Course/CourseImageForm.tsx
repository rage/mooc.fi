import { useCallback, useMemo, useState } from "react"

import { useRouter } from "next/router"
import { useFormContext } from "react-hook-form"

import { Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { FormFieldGroup, FormSubtitle } from "../Common"
import { ControlledHiddenField, ControlledImageInput } from "../Common/Fields"
import { useEditorContext } from "../EditorContext"
import ImportPhotoDialog from "./ImportPhotoDialog"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import useWhyDidYouUpdate from "/lib/why-did-you-update"
import CoursesTranslations from "/translations/courses"
import { addDomain } from "/util/imageUtils"

import { EditorCourseOtherCoursesFieldsFragment } from "/graphql/generated"

const ImportButton = styled(Button)`
  margin-top: 0.5rem;
  width: 100%;
`

interface CourseImageFormProps {
  courses?: EditorCourseOtherCoursesFieldsFragment[]
}

function CourseImageForm(props: CourseImageFormProps) {
  useWhyDidYouUpdate("CourseImageForm", props)
  const { courses } = props
  const { locale = "fi" } = useRouter()
  const t = useTranslator(CoursesTranslations)
  const { watch, setValue } = useFormContext()
  const { initialValues } = useEditorContext<CourseFormValues>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const onImageLoad = useCallback(
    (value: string | ArrayBuffer | null) => setValue("thumbnail", value),
    [],
  )
  const onImageAccepted = useCallback(
    (value: File) => setValue("new_photo", value, { shouldDirty: true }),
    [],
  )

  const onImageRemove = useEventCallback(
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
        onImageRemove={onImageRemove}
        thumbnail={addDomain(watch("thumbnail"))}
      />
      <ImportButton color="primary" onClick={onImportPhotoDialogOpen}>
        {t("importPhotoButton")}
      </ImportButton>
      <ImportPhotoDialog
        open={dialogOpen}
        onClose={onImportPhotoDialogClose}
        courses={coursesWithPhotos}
      />
    </FormFieldGroup>
  )
}

export default CourseImageForm
