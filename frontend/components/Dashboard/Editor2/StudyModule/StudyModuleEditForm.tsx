import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
import { StudyModuleFormValues } from "/components/Dashboard/Editor2/StudyModule/types"
import { StudyModuleDetails_study_module } from "/static/types/generated/StudyModuleDetails"
import StudyModulesTranslations from "/translations/study-modules"
import { useTranslator } from "/util/useTranslator"
import EditorContainer from "../EditorContainer"
import { useFormContext } from "react-hook-form"
import { FormSubtitle } from "../common"
import { ControlledHiddenField, ControlledTextField } from "../FormFields"
import styled from "styled-components"
import { useEffect, useState } from "react"
import { Typography } from "@material-ui/core"
import StudyModuleTranslationsForm from "./StudyModuleTranslationsForm"
import useDebounce from "/util/useDebounce"

interface StudyModuleEditFormProps {
  module?: StudyModuleDetails_study_module
}

const ModuleImage = styled.img<{ error?: boolean }>`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 250px;
  display: ${(props) => (props.error ? "none" : "")};
`

const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

export default function StudyModuleEditForm({
  module,
}: StudyModuleEditFormProps) {
  const t = useTranslator(StudyModulesTranslations)
  const {
    onSubmit,
    onError,
    initialValues,
  } = useEditorContext<StudyModuleFormValues>()
  const {
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState,
  } = useFormContext()

  const [imageFilename, setImageFilename] = useState(pixel)
  const [imageError, setImageError] = useState("")
  const image = watch("image")
  const slug = watch("new_slug")
  //const [image] = useDebounce(() => getValues("image"), 500)
  //const [slug] = useDebounce(() => getValues("slug"), 500)

  console.log(formState)
  useEffect(() => {
    if (image) {
      setImageFilename(`/static/images/${image}`)
    } else {
      setImageFilename(`/static/images/${slug}.jpg`)
    }
  }, [image, slug])

  return (
    <EditorContainer<StudyModuleFormValues>>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        style={{ backgroundColor: "white", padding: "2rem" }}
        autoComplete="none"
      >
        <FormSubtitle variant="h6" component="h3" align="center">
          {t("moduleDetailsTitle")}
        </FormSubtitle>
        <ControlledHiddenField name="slug" defaultValue={watch("slug")} />
        <ControlledTextField name="name" label={t("moduleName")} />
        <ControlledTextField
          name="order"
          label={t("moduleOrder")}
          type="number"
        />
        <ControlledTextField name="new_slug" label={t("moduleSlug")} />
        <ControlledTextField name="id" label={t("moduleID")} disabled />
        <ControlledTextField
          name="image"
          label={t("moduleImageName")}
          tip={t("moduleImageTooltip")}
        />
        <FormSubtitle variant="h6" component="h3" align="center">
          {t("modulePhotoTitle")}
        </FormSubtitle>
        <ModuleImage
          src={imageFilename}
          error={Boolean(imageError)}
          onError={() => {
            //setError("image", { message: t("moduleImageError") })
            setImageError(t("moduleImageError"))
          }}
          onLoad={() => {
            //clearErrors("image")
            setImageError("")
          }}
        />
        {!!imageError ? (
          <Typography variant="body2" style={{ color: "#FF0000" }}>
            {imageError}
          </Typography>
        ) : null}
        <StudyModuleTranslationsForm />
      </form>
    </EditorContainer>
  )
}
