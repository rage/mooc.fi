import { useEffect, useState } from "react"

import { useFormContext } from "react-hook-form"

import styled from "@emotion/styled"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

import { ControlledSelect } from "/components/Dashboard/Editor2/Common/Fields"
import {
  CourseEditorCourses_courses,
  CourseEditorCourses_courses_photo,
} from "/static/types/generated/CourseEditorCourses"
import CoursesTranslations from "/translations/courses"
import { addDomain } from "/util/imageUtils"
import { useTranslator } from "/util/useTranslator"

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  min-width: 350px;
  min-height: 250px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 4px;
`

const ImagePlaceholder = styled.div`
  width: 350px;
  height: 250px;
  background-color: #eeeeee;
`

interface ImportPhotoDialogProps {
  courses?: CourseEditorCourses_courses[]
  open: boolean
  onClose: () => void
}

export default function ImportPhotoDialog({
  open,
  onClose,
  courses = [],
}: ImportPhotoDialogProps) {
  const { setValue, getValues, watch } = useFormContext()
  const [selected, setSelected] = useState<CourseEditorCourses_courses | null>(
    null,
  )
  const t = useTranslator(CoursesTranslations)

  const fetchBase64 = (
    photo: CourseEditorCourses_courses_photo,
    filename: string,
  ) => {
    fetch(filename, {
      mode: "no-cors",
      cache: "no-cache",
      headers: { Origin: "https://www.mooc.fi" },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], photo?.name ?? "", {
          type: photo?.original_mimetype ?? "image/png",
        })
        setValue("new_photo", file)
      })
  }

  const fetchURL = (
    photo: CourseEditorCourses_courses_photo,
    filename: string,
  ) => {
    const req = new XMLHttpRequest()
    req.open("GET", filename, true)
    req.responseType = "blob"
    req.onload = () => {
      const file = new File([req.response], photo?.name ?? "", {
        type: photo?.original_mimetype ?? "image/png",
      })
      setValue("new_photo", file)
    }
    req.send()
  }

  const photo = watch("import_photo")

  const handleSelection = () => {
    const photo = (
      courses?.find((course) => course.id === getValues("import_photo")) ?? {}
    ).photo

    if (!photo) {
      return
    }

    const base64 = photo?.original?.startsWith("data") ?? false
    setValue("thumbnail", photo?.compressed)
    const filename =
      (base64 ? photo?.original : addDomain(photo?.original)) ?? ""
    if (base64) {
      fetchBase64(photo, filename)
    } else {
      fetchURL(photo, filename)
    }
    onClose()
  }

  useEffect(() => {
    const _selected =
      courses?.find((course) => course.id === getValues("import_photo")) ?? null

    setSelected(_selected)
  }, [photo])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("importPhotoDialogTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("importPhotoDialogContent")}</DialogContentText>
        <ControlledSelect
          name="import_photo"
          label={t("importPhotoLabel")}
          items={courses}
        />
        <ImageContainer>
          {selected ? (
            <img
              src={addDomain(selected.photo?.compressed)}
              alt={selected.photo?.name ?? "selected image"}
              height="200"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </ImageContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("importPhotoDialogCancel")}
        </Button>
        <Button color="primary" onClick={handleSelection}>
          {t("importPhotoDialogSelect")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
