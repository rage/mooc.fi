import { useCallback, useEffect, useMemo, useState } from "react"

import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikHelpers,
  getIn,
  useFormikContext,
  yupToFormErrors,
} from "formik"
import { useConfirm } from "material-ui-confirm"
import Image from "next/image"

import HelpIcon from "@mui/icons-material/Help"
import {
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  FormSubtitle,
  OutlinedFormControl,
  OutlinedFormGroup,
  OutlinedInputLabel,
  StyledField,
  StyledFieldWithAnchor,
  StyledTextField,
} from "../common"
import FormWrapper from "../FormWrapper"
import {
  initialTranslation,
  languages,
  StudyModuleEditSchemaType,
} from "./form-validation"
import { StudyModuleFormValues } from "./types"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import useDebounce from "/hooks/useDebounce"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import StudyModulesTranslations from "/translations/study-modules"

const FormContainer = styled("div")`
  background-color: white;
  padding: 1rem;
`

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

// prevent borked image on page load
const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

// capitalized to please the hook linter
const StudyModuleFormComponent = () => {
  const { errors, values, isSubmitting } =
    useFormikContext<StudyModuleFormValues>()

  const t = useTranslator(StudyModulesTranslations, CommonTranslations)
  const confirm = useConfirm()

  const [imageError, setImageError] = useState("")

  const [image] = useDebounce(values.image, 500)
  const [slug] = useDebounce(values.new_slug, 500)

  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    setImageLoading(true)

    return () => {
      setImageLoading(false)
    }
  }, [image, slug])

  const imageFilename = useMemo(() => {
    return image ?? `${slug}.jpg`
  }, [image, slug])

  const onImageError = useCallback(() => {
    setImageLoading(false)
    setImageError(t("moduleImageError"))
  }, [t])

  const onImageLoadingComplete = useCallback(() => {
    setImageLoading(false)
    setImageError("")
  }, [])

  const onRemoveTranslationClick = useCallback(
    (helpers: FieldArrayRenderProps, index: number) => () =>
      confirm({
        title: t("moduleConfirmationTitle"),
        description: t("moduleConfirmationContent"),
        confirmationText: t("moduleConfirmationYes"),
        cancellationText: t("moduleConfirmationNo"),
      })
        .then(() => helpers.remove(index))
        .catch(() => {
          // ignore
        }),
    [],
  )

  const onAddTranslationClick = useCallback(
    (helpers: FieldArrayRenderProps) => () =>
      helpers.push({ ...initialTranslation }),
    [],
  )

  return (
    <FormContainer>
      <Form>
        <FormSubtitle variant="h6" component="h3" align="center">
          {t("moduleDetailsTitle")}
        </FormSubtitle>
        <Grid container direction="row" spacing={2}>
          <Grid item xs={10}>
            <StyledFieldWithAnchor
              name="name"
              type="text"
              label={t("moduleName")}
              error={errors.name}
              fullWidth
              required
              autoComplete="off"
              variant="outlined"
              component={StyledTextField}
            />
          </Grid>
          <Grid item xs={2}>
            <StyledFieldWithAnchor
              name="order"
              type="number"
              label={t("moduleOrder")}
              error={errors.order}
              fullWidth
              autoComplete="off"
              variant="outlined"
              component={StyledTextField}
            />
          </Grid>
        </Grid>
        <StyledFieldWithAnchor
          name="new_slug"
          type="text"
          label={t("moduleSlug")}
          error={errors.new_slug}
          fullWidth
          required
          variant="outlined"
          autoComplete="off"
          component={StyledTextField}
        />
        <StyledField
          id="module-id"
          style={{ width: "50%" }}
          name="id"
          type="text"
          disabled
          label={t("moduleID")}
          variant="outlined"
          component={StyledTextField}
        />
        <StyledFieldWithAnchor
          name="image"
          type="text"
          label={t("moduleImageName")}
          fullWidth
          required
          variant="outlined"
          autoComplete="off"
          component={StyledTextField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={t("moduleImageTooltip")}>
                  <HelpIcon />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <FormSubtitle variant="h6" component="h3" align="center">
          {t("modulePhotoTitle")}
        </FormSubtitle>
        <OutlinedFormControl variant="outlined" error={!!imageError}>
          <OutlinedInputLabel shrink>
            {t("moduleImagePreview")}
          </OutlinedInputLabel>
          <OutlinedFormGroup>
            <ImageContainer>
              {imageLoading && (
                <CircularProgress
                  size={100}
                  style={{ objectFit: "contain", objectPosition: "50% 50%" }}
                />
              )}
              <ModuleImage
                src={
                  imageFilename
                    ? `/images/modules/${imageFilename}` + "?v=" + Date.now()
                    : pixel
                }
                alt={
                  !imageError
                    ? `Image preview of ${imageFilename ?? "a module image"}`
                    : ``
                }
                error={!!imageError}
                isLoading={imageLoading}
                priority
                fill
                onError={onImageError}
                onLoadingComplete={onImageLoadingComplete}
              />
              {!imageLoading && !!imageError ? (
                <Typography variant="body2" style={{ color: "red" }}>
                  {imageError}
                </Typography>
              ) : null}
            </ImageContainer>
          </OutlinedFormGroup>
        </OutlinedFormControl>
        <FormSubtitle variant="h6" component="h3" align="center">
          {t("moduleTranslationsTitle")}
        </FormSubtitle>
        <Grid container direction="column">
          <FieldArray name="study_module_translations">
            {(helpers) => (
              <>
                {values?.study_module_translations?.map(
                  (translation, index: number) => (
                    <LanguageEntry
                      item
                      key={translation.id ?? translation.language}
                    >
                      <EntryContainer elevation={2}>
                        <StyledFieldWithAnchor
                          name={`study_module_translations[${index}].language`}
                          type="select"
                          label={t("moduleLanguage")}
                          error={getIn(
                            errors,
                            `study_module_translations[${index}].language`,
                          )}
                          fullWidth
                          variant="outlined"
                          select
                          required
                          autoComplete="off"
                          component={StyledTextField}
                        >
                          {languages(t).map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </StyledFieldWithAnchor>
                        <StyledFieldWithAnchor
                          name={`study_module_translations[${index}].name`}
                          type="text"
                          label={t("moduleName")}
                          error={getIn(
                            errors,
                            `study_module_translations[${index}].name`,
                          )}
                          fullWidth
                          reuqired
                          autoComplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
                        <StyledFieldWithAnchor
                          name={`study_module_translations[${index}].description`}
                          type="textarea"
                          label={t("moduleDescription")}
                          error={getIn(
                            errors,
                            `study_module_translations[${index}].description`,
                          )}
                          fullWidth
                          multiline
                          rows={5}
                          required
                          autoComplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
                        <br />
                        <Grid container justifyItems="flex-end">
                          <StyledButton
                            variant="contained"
                            disabled={isSubmitting}
                            color="secondary"
                            onClick={onRemoveTranslationClick(helpers, index)}
                          >
                            {t("moduleRemoveTranslation")}
                          </StyledButton>
                        </Grid>
                      </EntryContainer>
                    </LanguageEntry>
                  ),
                ) ?? (
                  <EntryContainer elevation={2}>
                    <Typography variant="body1">
                      {t("moduleAtLeastOneTranslation")}
                    </Typography>
                  </EntryContainer>
                )}
                {values?.study_module_translations?.length <
                  languages(t).length && (
                  <FormSubmitButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    onClick={onAddTranslationClick(helpers)}
                  >
                    {t("moduleAddTranslation")}
                  </FormSubmitButton>
                )}
              </>
            )}
          </FieldArray>
        </Grid>
      </Form>
    </FormContainer>
  )
}

interface StudyModuleEditFormProps {
  module: StudyModuleFormValues
  validationSchema: StudyModuleEditSchemaType
  onSubmit: (
    values: StudyModuleFormValues,
    FormikHelpers: FormikHelpers<StudyModuleFormValues>,
  ) => void
  onCancel: () => void
  onDelete: (values: StudyModuleFormValues) => void
}

function StudyModuleEditForm({
  module,
  validationSchema,
  onSubmit,
  onCancel,
  onDelete,
}: StudyModuleEditFormProps) {
  const validate = useCallback(async (values: StudyModuleFormValues) => {
    try {
      await validationSchema.validate(values, {
        abortEarly: false,
        context: { values },
      })
    } catch (err) {
      return yupToFormErrors<StudyModuleFormValues>(err)
    }
  }, [])

  return (
    <Formik initialValues={module} validate={validate} onSubmit={onSubmit}>
      <FormWrapper<StudyModuleFormValues>
        onCancel={onCancel}
        onDelete={onDelete}
      >
        <StudyModuleFormComponent />
      </FormWrapper>
    </Formik>
  )
}

export default StudyModuleEditForm
