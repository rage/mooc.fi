import React, { useCallback, useState, useEffect, useContext } from "react"
import { StudyModuleFormValues } from "./types"
import {
  Field,
  Formik,
  Form,
  FormikActions,
  FormikProps,
  yupToFormErrors,
  FieldArray,
  getIn,
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
import ConfirmationDialog from "/components/Dashboard/ConfirmationDialog"
import useDebounce from "/util/useDebounce"
import HelpIcon from "@material-ui/icons/Help"
import {
  StyledTextField,
  OutlinedFormControl,
  OutlinedInputLabel,
  OutlinedFormGroup,
} from "/components/Dashboard/Editor/common"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { EntryContainer } from "/components/Surfaces/EntryContainer"
import { LanguageEntry } from "/components/Surfaces/LanguageEntryGrid"
import getModulesTranslator from "/translations/study-modules"
import LanguageContext from "/contexes/LanguageContext"

const ModuleImage = styled.img<{ error?: boolean }>`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 250px;
  display: ${props => (props.error ? "none" : "")};
`

// prevent borked image on page load
const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

// capitalized to please the hook linter
const RenderForm = ({
  errors,
  values,
  isSubmitting,
}: Pick<
  FormikProps<StudyModuleFormValues>,
  "errors" | "values" | "isSubmitting" | "setFieldValue"
>) => {
  const { language } = useContext(LanguageContext)
  const t = getModulesTranslator(language)

  const [imageError, setImageError] = useState("")
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false)
  const [removableIndex, setRemovableIndex] = useState(-1)

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
    <Form>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={10}>
          <Field
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
          <Field
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
      <Field
        name="new_slug"
        type="text"
        label={t("moduleSlug")}
        error={errors.new_slug}
        fullWidth
        variant="outlined"
        autoComplete="off"
        component={StyledTextField}
      />
      <Field
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

      <Grid container direction="column">
        <FieldArray
          name="study_module_translations"
          render={helpers => (
            <>
              <ConfirmationDialog
                title={t("moduleConfirmationTitle")}
                content={t("moduleConfirmationContent")}
                acceptText={t("moduleConfirmationYes")}
                rejectText={t("moduleConfirmationNo")}
                onAccept={() => {
                  setRemoveDialogVisible(false)
                  removableIndex >= 0 && helpers.remove(removableIndex)
                  setRemovableIndex(-1)
                }}
                onReject={() => {
                  setRemoveDialogVisible(false)
                  setRemovableIndex(-1)
                }}
                show={removeDialogVisible}
              />
              {values?.study_module_translations?.map(
                (_: any, index: number) => (
                  <LanguageEntry item key={`translation-${index}`}>
                    <EntryContainer elevation={2}>
                      <Field
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
                        {languages(t).map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                      <Field
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
                      <Field
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
                          onClick={() => {
                            setRemoveDialogVisible(true)
                            setRemovableIndex(index)
                          }}
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
        />
      </Grid>
    </Form>
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
  validationSchema: Yup.ObjectSchema
  onSubmit: (
    values: StudyModuleFormValues,
    formikActions: FormikActions<StudyModuleFormValues>,
  ) => void
  onCancel: () => void
  onDelete: (values: StudyModuleFormValues) => void
}) => {
  const validate = useCallback(
    async (values: StudyModuleFormValues) =>
      validationSchema
        .validate(values, { abortEarly: false, context: { values } })
        .catch(err => {
          throw yupToFormErrors(err)
        }),
    [],
  )

  return (
    <Formik
      initialValues={module}
      validate={validate}
      onSubmit={onSubmit}
      render={formikProps => (
        <FormWrapper<StudyModuleFormValues>
          {...formikProps}
          renderForm={RenderForm}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    />
  )
}

export default StudyModuleEditForm
