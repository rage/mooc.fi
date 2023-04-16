import { useEffect, useState } from "react"

import { Field, useFormikContext } from "formik"
import Image from "next/image"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { StyledTextField } from "../common"
import { CourseFormValues } from "./types"
import { useTranslator } from "/hooks/useTranslator"
import CoursesTranslations from "/translations/courses"
import { addDomain } from "/util/imageUtils"

import {
  EditorCourseOtherCoursesFieldsFragment,
  ImageCoreFieldsFragment,
} from "/graphql/generated"

const ImageContainer = styled("div")`
  display: flex;
  width: 100%;
  min-width: 350px;
  min-height: 250px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-radius: 4px;
  position: relative;
`

const ImagePlaceholder = styled("div")`
  width: 350px;
  height: 250px;
  background-color: #eeeeee;
`

interface ImportPhotoDialogProps {
  open: boolean
  onClose: () => void
  courses: EditorCourseOtherCoursesFieldsFragment[]
}

const ImportPhotoDialog = ({
  open,
  onClose,
  courses,
}: ImportPhotoDialogProps) => {
  const { values, setFieldValue } = useFormikContext<CourseFormValues>()
  const [selectedCourse, setSelectedCourse] = useState(
    courses?.find((course) => course.id === values.import_photo) ?? {
      photo: undefined,
    },
  )
  const t = useTranslator(CoursesTranslations)

  useEffect(() => {
    setSelectedCourse(
      courses?.find((course) => course.id === values.import_photo) ?? {
        photo: undefined,
      },
    )
  }, [values.import_photo])

  const fetchBase64 = (photo: ImageCoreFieldsFragment, filename: string) => {
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
        setFieldValue("new_photo", file)
      })
  }

  const fetchURL = (photo: ImageCoreFieldsFragment, filename: string) => {
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
    const { photo } = selectedCourse

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
          {courses?.map((course) => (
            <MenuItem key={course.slug} value={course.id ?? ""}>
              {course.name}
            </MenuItem>
          ))}
        </Field>
        <ImageContainer>
          {values.import_photo ? (
            <Image
              src={addDomain(selectedCourse?.photo?.compressed)}
              alt={selectedCourse?.photo?.name ?? "image from other course"}
              style={{ objectFit: "contain" }}
              fill
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

export default ImportPhotoDialog
