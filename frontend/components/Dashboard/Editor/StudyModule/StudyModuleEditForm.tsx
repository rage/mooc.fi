import { useCallback, useEffect, useState } from "react"
import { StudyModuleFormValues } from "./types"
import {
  Formik,
  Form,
  FormikHelpers,
  yupToFormErrors,
  FieldArray,
  getIn,
  useFormikContext,
} from "formik"
import {
  Grid,
  MenuItem,
  Typography,
  InputAdornment,
  Tooltip,
} from "@material-ui/core"
import * as Yup from "yup"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import { languages, initialTranslation } from "./form-validation"
import styled from "styled-components"
import useDebounce from "/util/useDebounce"
import HelpIcon from "@material-ui/icons/Help"
import {
  StyledField,
  StyledTextField,
  OutlinedFormControl,
  OutlinedInputLabel,
  OutlinedFormGroup,
  StyledFieldWithAnchor,
} from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import ModulesTranslations from "/translations/study-modules"
import { useConfirm } from "material-ui-confirm"
import { FormSubtitle } from "/components/Dashboard/Editor/common"
import { useTranslator } from "/util/useTranslator"

const FormContainer = styled.div`
  background-color: white;
  padding: 1rem;
`

const ModuleImage = styled.img<{ error?: boolean }>`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 250px;
  display: ${(props) => (props.error ? "none" : "")};
`

// prevent borked image on page load
const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

// capitalized to please the hook linter
const RenderForm = () => {
  const {
    errors,
    values,
    isSubmitting,
  } = useFormikContext<StudyModuleFormValues>()

  const t = useTranslator(ModulesTranslations)
  const confirm = useConfirm()

  const [imageError, setImageError] = useState("")

  const [image] = useDebounce(values.image, 500)
  const [slug] = useDebounce(values.new_slug, 500)

  const [imageFilename, setImageFilename] = useState(pixel)

  useEffect(() => {
    if (image) {
      setImageFilename(`/static/images/${image}`)
    } else {
      setImageFilename(`/static/images/${slug}.jpg`)
    }
  }, [image, slug])

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
            <ModuleImage
              src={imageFilename}
              error={!!imageError}
              onError={() => setImageError(t("moduleImageError"))}
              onLoad={() => setImageError("")}
            />
            {!!imageError ? (
              <Typography variant="body2" style={{ color: "#FF0000" }}>
                {imageError}
              </Typography>
            ) : null}
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
                  (_: any, index: number) => (
                    <LanguageEntry item key={`translation-${index}`}>
                      <EntryContainer elevation={2}>
                        <StyledFieldWithAnchor
                          name={`study_module_translations[${index}].language`}
                          type="select"
                          label={t("moduleLanguage")}
                          errors={[
                            getIn(
                              errors,
                              `study_module_translations[${index}].language`,
                            ),
                          ]}
                          fullWidth
                          variant="outlined"
                          select
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
                          autoComplete="off"
                          variant="outlined"
                          component={StyledTextField}
                        />
                        <br />
                        <Grid container justify="flex-end">
                          <StyledButton
                            variant="contained"
                            disabled={isSubmitting}
                            color="secondary"
                            onClick={() =>
                              confirm({
                                title: t("moduleConfirmationTitle"),
                                description: t("moduleConfirmationContent"),
                                confirmationText: t("moduleConfirmationYes"),
                                cancellationText: t("moduleConfirmationNo"),
                              })
                                .then(() => helpers.remove(index))
                                .catch(() => {})
                            }
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
                    onClick={() => helpers.push({ ...initialTranslation })}
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

const StudyModuleEditForm = ({
  module,
  validationSchema,
  onSubmit,
  onCancel,
  onDelete,
}: {
  module: StudyModuleFormValues
  validationSchema: Yup.ObjectSchema<any>
  onSubmit: (
    values: StudyModuleFormValues,
    FormikHelpers: FormikHelpers<StudyModuleFormValues>,
  ) => void
  onCancel: () => void
  onDelete: (values: StudyModuleFormValues) => void
}) => {
  const validate = useCallback(async (values: StudyModuleFormValues) => {
    try {
      await validationSchema.validate(values, {
        abortEarly: false,
        context: { values },
      })
    } catch (err) {
      return yupToFormErrors(err)
    }
  }, [])

  return (
    <Formik initialValues={module} validate={validate} onSubmit={onSubmit}>
      <FormWrapper<StudyModuleFormValues>
        renderForm={RenderForm}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </Formik>
  )
}

export default StudyModuleEditForm
