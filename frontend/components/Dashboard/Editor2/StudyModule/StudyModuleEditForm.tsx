import { useEffect, useMemo, useState } from "react"

import Image from "next/image"
import { useFormContext } from "react-hook-form"

import styled from "@emotion/styled"
import { CircularProgress, Typography } from "@mui/material"

import EditorContainer from "../EditorContainer"
import StudyModuleTranslationsForm from "./StudyModuleTranslationsForm"
import { FormSubtitle } from "/components/Dashboard/Editor2/Common"
import {
  ControlledHiddenField,
  ControlledTextField,
} from "/components/Dashboard/Editor2/Common/Fields"
import { StudyModuleFormValues } from "/components/Dashboard/Editor2/StudyModule/types"
import StudyModulesTranslations from "/translations/study-modules"
import useDebounce from "/util/useDebounce"
import { useTranslator } from "/util/useTranslator"

const ImageContainer = styled.div`
  position: relative;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModuleImage = styled(Image)<{ error?: boolean; isLoading?: boolean }>`
  object-fit: cover;
  display: ${(props) => (props.error || props.isLoading ? "none" : "")};
`

const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

export default function StudyModuleEditForm() {
  const t = useTranslator(StudyModulesTranslations)
  const { watch } = useFormContext()

  const [imageError, setImageError] = useState("")
  const _image = watch("image")
  const _slug = watch("new_slug")

  const [image] = useDebounce(_image, 500)
  const [slug] = useDebounce(_slug, 500)

  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    setImageLoading(true)

    return () => {
      setImageLoading(false)
    }
  }, [image, slug])

  const imageFilename = useMemo(() => {
    if (image) {
      return `/static/images/${image}`
    }
    return `/static/images/${slug}.jpg`
  }, [image, slug])

  return (
    <EditorContainer<StudyModuleFormValues>>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("moduleDetailsTitle")}
      </FormSubtitle>
      <ControlledHiddenField name="slug" defaultValue={watch("slug")} />
      <ControlledTextField name="name" label={t("moduleName")} revertable />
      <ControlledTextField
        name="order"
        label={t("moduleOrder")}
        type="number"
        revertable
      />
      <ControlledTextField name="new_slug" label={t("moduleSlug")} revertable />
      <ControlledTextField name="id" label={t("moduleID")} disabled />
      <ControlledTextField
        name="image"
        label={t("moduleImageName")}
        tip={t("moduleImageTooltip")}
        revertable
      />
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("modulePhotoTitle")}
      </FormSubtitle>
      <ImageContainer>
        {imageLoading && (
          <CircularProgress
            size={100}
            style={{ objectFit: "contain", objectPosition: "50% 50%" }}
          />
        )}
        <ModuleImage
          src={imageFilename ? imageFilename + "?v=" + Date.now() : pixel}
          alt={!imageError ? `Image preview of ${image}` : ``}
          error={!!imageError}
          isLoading={imageLoading}
          priority
          fill
          onError={() => {
            setImageLoading(false)
            setImageError(t("moduleImageError"))
          }}
          onLoadingComplete={() => {
            setImageLoading(false)
            setImageError("")
          }}
        />
        {!imageLoading && !!imageError ? (
          <Typography variant="body2" style={{ color: "red" }}>
            {imageError}
          </Typography>
        ) : null}
      </ImageContainer>
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("moduleTranslationsTitle")}
      </FormSubtitle>
      <StudyModuleTranslationsForm />
    </EditorContainer>
  )
}
