import React, { useContext, useCallback } from "react"
import {
  CourseEditorCourses_courses,
  CourseEditorCourses_courses_photo,
} from "/static/types/generated/CourseEditorCourses"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import LanguageContext from "/contexes/LanguageContext"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  MenuItem,
  DialogActions,
  Button,
} from "@material-ui/core"
import { Field } from "formik"
import { StyledTextField } from "/components/Dashboard/Editor/common"
import { addDomain } from "/util/imageUtils"
import getCoursesTranslator from "/translations/courses"
import styled from "styled-components"

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
  open: boolean
  onClose: () => void
  courses: CourseEditorCourses_courses[]
  values: CourseFormValues
  setFieldValue: (field: string, value: any) => void
}

const ImportPhotoDialog = ({
  open,
  onClose,
  courses,
  values,
  setFieldValue,
}: ImportPhotoDialogProps) => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)

  const selectedCourse = useCallback(
    () =>
      courses?.find(course => course.id === values.import_photo) ?? {
        photo: undefined,
      },
    [values.import_photo],
  )

  const fetchBase64 = (
    photo: CourseEditorCourses_courses_photo,
    filename: string,
  ) => {
    fetch(filename, {
      mode: "no-cors",
      cache: "no-cache",
      headers: { Origin: "https://www.mooc.fi" },
    })
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], photo?.name ?? "", {
          type: photo?.original_mimetype ?? "image/png",
        })
        setFieldValue("new_photo", file)
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
      setFieldValue("new_photo", file)
    }
    req.send()
  }

  const handleSelection = () => {
    const { photo } = selectedCourse()

    if (!photo) {
      return
    }

    const base64 = photo?.original?.startsWith("data") ?? false
    setFieldValue("thumbnail", photo?.compressed)
    const filename =
      (base64 ? photo?.original : addDomain(photo?.original)) ?? ""
    if (base64) {
      fetchBase64(photo, filename)
    } else {
      fetchURL(photo, filename)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("importPhotoDialogTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("importPhotoDialogContent")}</DialogContentText>
        <Field
          name="import_photo"
          type="select"
          label={t("importPhotoLabel")}
          variant="outlined"
          select
          autoComplete="off"
          component={StyledTextField}
        >
          {courses?.map((course: CourseEditorCourses_courses) => (
            <MenuItem key={course.slug} value={course.id ?? ""}>
              {course.name}
            </MenuItem>
          ))}
        </Field>
        <ImageContainer>
          {values.import_photo ? (
            <img
              src={addDomain(selectedCourse()?.photo?.compressed)}
              height="200"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </ImageContainer>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSelection}>
          {t("importPhotoDialogSelect")}
        </Button>
        <Button onClick={onClose}>{t("importPhotoDialogCancel")}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportPhotoDialog
