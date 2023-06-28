import { useCallback, useEffect, useMemo, useState } from "react"

import Image from "next/image"
import { useFormContext } from "react-hook-form"

import { CircularProgress, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { FormSubtitle } from "../Common"
import { ControlledHiddenField, ControlledTextField } from "../Common/Fields"
import StudyModuleTranslationsForm from "./StudyModuleTranslationsForm"
import DisableAutoComplete from "/components/DisableAutoComplete"
import useDebounce from "/hooks/useDebounce"
import { useTranslator } from "/hooks/useTranslator"
import StudyModulesTranslations from "/translations/study-modules"

const ImageContainer = styled("div")`
  position: relative;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModuleImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== "error" && prop !== "isLoading",
})<{ error?: boolean; isLoading?: boolean }>`
  object-fit: cover;
  display: ${(props) => (props.error || props.isLoading ? "none" : "")};
`

const ContainedCircularProgress = styled(CircularProgress)`
  object-fit: contain;
  object-position: 50% 50%;
`

const ImageError = styled(Typography)`
  color: red;
`

const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

function StudyModuleEditForm() {
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
      return `/images/modules/${image}`
    }
    return `/images/modules/${slug}.jpg`
  }, [image, slug])

  const onImageError = useCallback(() => {
    setImageLoading(false)
    setImageError(t("moduleImageError"))
  }, [t])

  const onImageLoadingComplete = useEventCallback(() => {
    setImageLoading(false)
    setImageError("")
  })

  return (
    <>
      <DisableAutoComplete key="disableautocomplete" />
      <FormSubtitle variant="h5" component="h3" align="center">
        {t("moduleDetailsTitle")}
      </FormSubtitle>
      <ControlledHiddenField name="slug" defaultValue={watch("slug")} />
      <ControlledTextField
        name="name"
        label={t("moduleName")}
        required
        revertable
      />
      <ControlledTextField
        name="order"
        label={t("moduleOrder")}
        type="number"
        revertable
      />
      <ControlledTextField
        name="new_slug"
        label={t("moduleSlug")}
        required
        revertable
      />
      <ControlledTextField name="id" label={t("moduleID")} disabled />
      <ControlledTextField
        name="image"
        label={t("moduleImageName")}
        tip={t("moduleImageTooltip")}
        required
        revertable
      />
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("modulePhotoTitle")}
      </FormSubtitle>
      <ImageContainer>
        {imageLoading && <ContainedCircularProgress size={100} />}
        <ModuleImage
          src={imageFilename ? imageFilename + "?v=" + Date.now() : pixel}
          alt={!imageError ? `Image preview of ${image}` : ``}
          error={!!imageError}
          isLoading={imageLoading}
          priority
          fill
          onError={onImageError}
          onLoadingComplete={onImageLoadingComplete}
        />
        {!imageLoading && !!imageError ? (
          <ImageError variant="body2">{imageError}</ImageError>
        ) : null}
      </ImageContainer>
      <StudyModuleTranslationsForm />
    </>
  )
}

export default StudyModuleEditForm
