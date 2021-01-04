import { useCallback, useEffect, useState } from "react"
import {
  Controller,
  useFormContext,
  ControllerRenderProps,
  useFieldArray,
  ArrayField,
} from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { EnumeratingAnchor } from "/components/Dashboard/Editor/common"
import {
  FormHelperText,
  TextField,
  Tooltip,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  Typography,
} from "@material-ui/core"
import DatePicker from "@material-ui/lab/DatePicker"
import HelpIcon from "@material-ui/icons/Help"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { addDomain } from "/util/imageUtils"
import { CourseDetails_course_photo } from "/static/types/generated/CourseDetails"
import { CourseEditorStudyModules_study_modules } from "/static/types/generated/CourseEditorStudyModules"
import styled from "styled-components"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"
import CoursesTranslations from "/translations/courses"
import { useConfirm } from "material-ui-confirm"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"

interface FieldProps {
  name: string
  label: string
  required?: boolean
  tab?: number
  defaultValue?: any
}
interface FieldControllerProps extends FieldProps {
  renderComponent: (props: ControllerRenderProps) => JSX.Element
}

export function FieldController({
  name,
  label,
  required = false,
  tab = 0,
  defaultValue = "",
  renderComponent,
  ...props
}: FieldControllerProps & React.HTMLProps<HTMLDivElement>) {
  const { control, errors, setValue } = useFormContext()

  const onChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(name, target.value, { shouldValidate: true }),
    [name],
  )

  return (
    <Controller
      name={name}
      control={control}
      autoComplete="disabled"
      defaultValue={defaultValue}
      render={(renderProps) => (
        <div {...props}>
          <EnumeratingAnchor id={name} tab={tab} />
          {renderComponent({ ...renderProps, onChange })}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <FormHelperText style={{ color: "#f44336" }}>
                {message}
              </FormHelperText>
            )}
          />
        </div>
      )}
    />
  )
}

interface ControlledFieldProps extends FieldProps {
  defaultValue?: any
  tip?: string
  validateOtherFields?: Array<string>
}

interface ControlledTextFieldProps extends ControlledFieldProps {
  type?: string
}

export function ControlledTextField(props: ControlledTextFieldProps) {
  const { errors, setValue } = useFormContext()
  const { label, required, name, tip, type } = props

  const [error, setError] = useState(Boolean(flattenKeys(errors)[name]))
  useEffect(() => {
    setError(Boolean(flattenKeys(errors)[name]))
  }, [errors])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value, { shouldDirty: true })
  }

  return (
    <FieldController
      {...props}
      style={{ marginBottom: "1.5rem" }}
      renderComponent={({ onBlur, value }) => (
        <TextField
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          label={label}
          required={required}
          variant="outlined"
          error={error}
          type={type}
          InputProps={{
            autoComplete: "none",
            endAdornment: tip ? (
              <Tooltip title={tip}>
                <HelpIcon />
              </Tooltip>
            ) : null,
          }}
        />
      )}
    />
  )
}

export function ControlledDatePicker(props: ControlledFieldProps) {
  const { watch, setValue, trigger } = useFormContext()
  const { name, label, validateOtherFields = [] } = props

  const onChange = (date: any) => {
    setValue(name, date, { shouldValidate: true, shouldDirty: true })
    return { value: date }
  }

  return (
    <FieldController
      {...props}
      style={{ marginBottom: "1.5rem" }}
      renderComponent={() => (
        <DatePicker
          value={watch(name)}
          onChange={onChange}
          onClose={() => trigger([name, ...validateOtherFields])}
          label={label}
          allowKeyboardControl={true}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
      )}
    />
  )
}

export const ControlledHiddenField = ({
  name,
  defaultValue = "",
}: {
  name: string
  defaultValue: any
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={(props) => <input type="hidden" {...props} />}
    />
  )
}

interface ControlledImageInputProps extends ControlledFieldProps {
  defaultValue?: CourseDetails_course_photo | null
}

export function ControlledImageInput(props: ControlledImageInputProps) {
  const { watch, setValue, control } = useFormContext()
  const { name, label, defaultValue } = props

  const onImageLoad = (value: string | ArrayBuffer | null) =>
    setValue("thumbnail", value)
  const onImageAccepted = (value: File) => (
    console.log(value), setValue(name, value, { shouldDirty: true })
  )

  const onClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setValue("thumbnail", "")
    setValue(name, null)

    if (defaultValue) {
      // TODO: not dirtying the form
      setValue("delete_photo", true, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  return (
    <>
      <ControlledHiddenField
        name="thumbnail"
        defaultValue={watch("thumbnail")}
      />
      <Controller
        name={name}
        type="file"
        label={label}
        control={control}
        render={() => (
          <ImageDropzoneInput
            onImageLoad={onImageLoad}
            onImageAccepted={onImageAccepted}
          >
            <ImagePreview
              file={addDomain(watch("thumbnail"))}
              onClose={onClose}
            />
          </ImageDropzoneInput>
        )}
      />
    </>
  )
}

const ModuleList = styled(List)`
  padding: 0px;
  max-height: 400px;
  overflow: auto;
`

const ModuleListItem = styled(ListItem)<any>`
  padding: 0px;
`

interface ControlledModuleListProps extends ControlledFieldProps {
  modules?: CourseEditorStudyModules_study_modules[]
}

export function ControlledModuleList(props: ControlledModuleListProps) {
  const { modules, label, name } = props
  const { setValue, getValues } = useFormContext()

  const setCourseModule = useCallback(
    (event: React.SyntheticEvent<Element, Event>, checked: boolean) =>
      setValue(
        name,
        {
          ...getValues(name),
          [(event.target as HTMLInputElement).id]: checked,
        },
        { shouldDirty: true },
      ),
    [],
  )

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <FormGroup>
        <ModuleList>
          <EnumeratingAnchor id={name} />
          <FieldController
            name={name}
            label={label}
            renderComponent={({
              value,
            }: {
              value: Record<string, boolean>
            }) => (
              <>
                {modules?.map((module) => (
                  <ModuleListItem key={module.id}>
                    <FormControlLabel
                      key={`module-${module.id}`}
                      checked={value[module.id] ?? false}
                      onChange={setCourseModule}
                      control={<Checkbox id={module.id} />}
                      label={module.name}
                    />
                  </ModuleListItem>
                ))}
              </>
            )}
          />
        </ModuleList>
      </FormGroup>
    </FormControl>
  )
}

export function ControlledCheckbox(props: ControlledFieldProps) {
  const { name, label } = props
  const { setValue } = useFormContext()

  const onChange = (_: any, checked: boolean) => setValue(name, checked)

  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={({ value }) => (
        <FormControlLabel
          key={name}
          label={label}
          checked={Boolean(value)}
          onChange={onChange}
          control={<Checkbox />}
        />
      )}
    />
  )
}

export const FormFieldGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 90%;
  margin: 1rem auto 3rem auto;
  border-width: 0px;
  border-bottom: 4px dotted #98b0a9;
`

const ArrayList = styled.ul`
  list-style: none;
  margin-block-start: 0;
  padding-inline-start: 0;
`

const ArrayItem = styled.li``

const ButtonWithWhiteText = styled(StyledButton)`
  color: white;
`
interface ControlledFieldArrayListProps<T> extends ControlledFieldProps {
  initialValues: T
  render: (item: Partial<ArrayField<T, "id">>, index: number) => JSX.Element
  removeWithoutConfirmationCondition: (
    item: Partial<ArrayField<T, "id">>,
  ) => boolean
  addCondition: (item: Partial<ArrayField<T, "id">>) => boolean
  removeConfirmationDescription: string
  noFieldsDescription: string
}

export function ControlledFieldArrayList<T extends { _id?: string }>(
  props: ControlledFieldArrayListProps<T>,
) {
  const t = useTranslator(CoursesTranslations)
  const {
    name,
    render,
    initialValues,
    removeConfirmationDescription,
    removeWithoutConfirmationCondition,
    noFieldsDescription,
    addCondition,
  } = props
  const { control, formState } = useFormContext()
  const { fields, append, remove } = useFieldArray<T>({
    name,
    control,
  })
  const { isSubmitting } = formState
  const confirm = useConfirm()

  return (
    <FormGroup>
      <ArrayList>
        {fields.length ? (
          fields.map((item, index) => (
            <ArrayItem key={`${name}-${item._id}`}>
              {render(item, index)}
              <StyledButton
                style={{ margin: "auto" }}
                variant="contained"
                disabled={isSubmitting}
                color="secondary"
                onClick={(e) => {
                  e.preventDefault()
                  if (removeWithoutConfirmationCondition(item)) {
                    remove(index)
                  } else {
                    confirm({
                      title: t("confirmationAreYouSure"),
                      description: removeConfirmationDescription,
                      confirmationText: t("confirmationYes"),
                      cancellationText: t("confirmationNo"),
                    })
                      .then(() => {
                        remove(index)
                      })
                      .catch(() => {})
                  }
                }}
                endIcon={<RemoveIcon>{t("courseRemove")}</RemoveIcon>}
              >
                {t("courseRemove")}
              </StyledButton>
            </ArrayItem>
          ))
        ) : (
          <Typography
            variant="h3"
            component="p"
            align="center"
            gutterBottom={true}
          >
            {noFieldsDescription}
          </Typography>
        )}
        {(fields!.length == 0 ||
          (fields!.length && addCondition(fields![fields!.length - 1]))) && (
          <ButtonWithWhiteText
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            onClick={() => append({ ...initialValues })}
            endIcon={<AddIcon>{t("courseAdd")}</AddIcon>}
            style={{ width: "45%" }}
          >
            {t("courseAdd")}
          </ButtonWithWhiteText>
        )}
      </ArrayList>
    </FormGroup>
  )
}
