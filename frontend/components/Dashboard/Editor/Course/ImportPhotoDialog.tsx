import { useCallback, useMemo } from "react"

import Image from "next/image"
import { useFormContext } from "react-hook-form"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledSelect } from "../Common/Fields"
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
  courses?: EditorCourseOtherCoursesFieldsFragment[]
  open: boolean
  onClose: () => void
}

function ImportPhotoDialog({
  open,
  onClose,
  courses = [],
}: ImportPhotoDialogProps) {
  const { setValue, getValues, watch } = useFormContext()
  const t = useTranslator(CoursesTranslations)

  const fetchBase64 = useCallback(
    (photo: ImageCoreFieldsFragment, filename: string) => {
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
    },
    [setValue],
  )

  const fetchURL = useCallback(
    (photo: ImageCoreFieldsFragment, filename: string) => {
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
    },
    [setValue],
  )

  const photo = watch("import_photo")

  const handleSelection = useCallback(() => {
    const selectedPhoto = courses?.find((course) => course.id === photo)?.photo

    if (!selectedPhoto) {
      return
    }

    const base64 = selectedPhoto?.original?.startsWith("data") ?? false
    setValue("thumbnail", selectedPhoto?.compressed)
    const filename =
      (base64 ? selectedPhoto?.original : addDomain(selectedPhoto?.original)) ??
      ""
    if (base64) {
      fetchBase64(selectedPhoto, filename)
    } else {
      fetchURL(selectedPhoto, filename)
    }
    onClose()
  }, [photo, courses, getValues, onClose, setValue, watch])

  const selected = useMemo(
    () => courses?.find((course) => course.id === photo) ?? null,
    [courses, photo],
  )

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
            <Image
              src={addDomain(selected.photo?.compressed)}
              alt={selected.photo?.name ?? "selected image"}
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
