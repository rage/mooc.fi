import { StudyModuleFormValues } from "/components/Dashboard/Editor2/StudyModule/types"
import StudyModulesTranslations from "/translations/study-modules"
import { useTranslator } from "/util/useTranslator"
import EditorContainer from "../EditorContainer"
import { useFormContext } from "react-hook-form"
import { FormSubtitle } from "/components/Dashboard/Editor2/Common"
import {
  ControlledTextField,
  ControlledHiddenField,
} from "/components/Dashboard/Editor2/Common/Fields"
import styled from "@emotion/styled"
import { useEffect, useState } from "react"
import { Typography } from "@mui/material"
import StudyModuleTranslationsForm from "./StudyModuleTranslationsForm"
import useDebounce from "/util/useDebounce"

const ModuleImage = styled.img<{ error?: boolean }>`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 250px;
  display: ${(props) => (props.error ? "none" : "")};
`

const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

export default function StudyModuleEditForm() {
  const t = useTranslator(StudyModulesTranslations)
  const { watch } = useFormContext()

  const [imageFilename, setImageFilename] = useState(pixel)
  const [imageError, setImageError] = useState("")
  const _image = watch("image")
  const _slug = watch("new_slug")

  const [image] = useDebounce(_image, 500)
  const [slug] = useDebounce(_slug, 500)
  //const [image] = useDebounce(() => getValues("image"), 500)
  //const [slug] = useDebounce(() => getValues("slug"), 500)

  useEffect(() => {
    if (image) {
      setImageFilename(`/static/images/${image}`)
    } else {
      setImageFilename(`/static/images/${slug}.jpg`)
    }
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
      <ModuleImage
        src={imageFilename}
        error={Boolean(imageError)}
        onError={() => {
          setImageError(t("moduleImageError"))
        }}
        onLoad={() => {
          setImageError("")
        }}
      />
      {!!imageError ? (
        <Typography variant="body2" style={{ color: "#FF0000" }}>
          {imageError}
        </Typography>
      ) : null}
      <FormSubtitle variant="h6" component="h3" align="center">
        {t("moduleTranslationsTitle")}
      </FormSubtitle>
      <StudyModuleTranslationsForm />
    </EditorContainer>
  )
}
