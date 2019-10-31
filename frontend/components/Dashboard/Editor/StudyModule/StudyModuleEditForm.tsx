import React, { useCallback, useState, useEffect } from "react"
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
  InputLabel,
  FormGroup,
  FormControl,
  Grid,
  MenuItem,
  Typography,
  InputAdornment,
  Tooltip,
  Paper,
  Button,
} from "@material-ui/core"
import * as Yup from "yup"
import FormWrapper from "/components/Dashboard/Editor/FormWrapper"
import { languages, initialTranslation } from "./form-validation"
import styled from "styled-components"
import { TextField } from "formik-material-ui"
import ConfirmationDialog from "/components/Dashboard/ConfirmationDialog"
import useDebounce from "/util/useDebounce"
import HelpIcon from "@material-ui/icons/Help"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const OutlinedInputLabel = styled(InputLabel)`
  background-color: #ffffff;
  padding: 0 4px 0 4px;
`

const OutlinedFormControl = styled(FormControl)`
  margin-bottom: 1rem;
`

const OutlinedFormGroup = styled(FormGroup)<{ error?: boolean }>`
  border-radius: 4px;
  border: 1px solid;
  border-color: ${props => (props.error ? "#F44336" : "rgba(0, 0, 0, 0.23)")};
  padding: 18.5px 14px;
  transition: padding-left 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }

  &:focus {
    bordercolor: "#3f51b5";
  }

  @media (hover: none) {
    border: 1px solid rgba(0, 0, 0, 0.23);
  }
`

const ModuleImage = styled.img<{ error?: boolean }>`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 250px;
  display: ${props => (props.error ? "none" : "")};
`

const LanguageEntry = styled(Grid)`
  spacing: 10px;
  line-height: 2;
  padding: 0 0 20px 0;
`

const EntryContainer = styled(Paper)`
  border-left: 2px solid #a0a0ff;
  padding: 20px;
`

// prevent borked image on page load
const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="

const renderForm = ({
  errors,
  values,
  isSubmitting,
}: Pick<
  FormikProps<StudyModuleFormValues>,
  "errors" | "values" | "isSubmitting" | "setFieldValue"
>) => {
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
            label="Name"
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
            label="Order"
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
        label="Slug"
        error={errors.new_slug}
        fullWidth
        variant="outlined"
        autoComplete="off"
        component={StyledTextField}
      />
      <Field
        name="image"
        type="text"
        label="Image filename"
        fullWidth
        variant="outlined"
        autoComplete="off"
        component={StyledTextField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="By default, the module image filename is the slug followed by .jpg. Enter a filename with an extension here to override it.">
                <HelpIcon />
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <OutlinedFormControl variant="outlined" error={!!imageError}>
        <OutlinedInputLabel shrink>Image preview</OutlinedInputLabel>
        <OutlinedFormGroup>
          <ModuleImage
            src={imageFilename}
            error={!!imageError}
            onError={() => setImageError("no image found")}
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
                title="Are you sure?"
                content="Do you want to remove this translation?"
                acceptText="Yes"
                rejectText="No"
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
              {values && (values.study_module_translations || []).length ? (
                (values.study_module_translations || []).map(
                  (_: any, index: number) => (
                    <LanguageEntry item key={`translation-${index}`}>
                      <EntryContainer elevation={2}>
                        <Field
                          name={`study_module_translations[${index}].language`}
                          type="select"
                          label="Language"
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
                          {languages.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                        <Field
                          name={`study_module_translations[${index}].name`}
                          type="text"
                          label="Name"
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
                          label="Description"
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
                          <Button
                            variant="contained"
                            disabled={isSubmitting}
                            color="secondary"
                            onClick={() => {
                              setRemoveDialogVisible(true)
                              setRemovableIndex(index)
                            }}
                          >
                            Remove translation
                          </Button>
                        </Grid>
                      </EntryContainer>
                    </LanguageEntry>
                  ),
                )
              ) : (
                <EntryContainer elevation={2}>
                  <Typography variant="body1">
                    Please add at least one translation!
                  </Typography>
                </EntryContainer>
              )}
              {values &&
                (values.study_module_translations || []).length <
                  languages.length && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitting}
                    onClick={() => helpers.push({ ...initialTranslation })}
                  >
                    Add translation
                  </Button>
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
          renderForm={renderForm}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
    />
  )
}

export default StudyModuleEditForm
