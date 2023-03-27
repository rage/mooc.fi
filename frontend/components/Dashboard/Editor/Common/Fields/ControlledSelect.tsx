import { useCallback } from "react"

import {
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form"

import { InputAdornment, MenuItem, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { useErrorMessage } from ".."
import { useCourseEditorData } from "../../Course/CourseEditorDataContext"
import { FormValues } from "../../types"
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"
import RevertButton from "/components/RevertButton"
import { useTranslator } from "/hooks/useTranslator"
import useWhyDidYouUpdate from "/lib/why-did-you-update"
import CommonTranslations from "/translations/common"

const StyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
`

const ShiftedInputAdornment = styled(InputAdornment)`
  position: absolute;
  padding: 0;
  right: 16px;
  top: 50%;
`

interface ControlledSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControlledFieldProps<TFieldValues, TName> {
  items: Array<PathValue<TFieldValues, TName>>
  keyField?: FieldPath<TFieldValues>
  nameField?: FieldPath<TFieldValues>
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    value?: any,
  ) => void
}

export function ControlledSelect<
  TFieldValues extends FormValues = FormValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledSelectProps<TFieldValues, TName>) {
  const t = useTranslator(CommonTranslations)
  const { defaultValues } = useCourseEditorData()
  const { resetField } = useFormContext()
  const {
    label,
    items,
    required,
    keyField = "id",
    nameField = "name",
    name,
    revertable,
  } = props
  useWhyDidYouUpdate(`ControlledSelect ${name}`, props)
  const anchor = useAnchor(name)
  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const { error, hasError } = useErrorMessage(name)

  const onRevert = useCallback(() => resetField(name), [name])

  return (
    <StyledTextField
      select
      id={name}
      variant="outlined"
      label={label}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={(el) => {
        field.ref(el)
        anchor.ref(el)
      }}
      error={hasError}
      helperText={error}
      required={required}
      InputLabelProps={{
        shrink: Boolean(field.value),
      }}
      {...(revertable && {
        InputProps: {
          startAdornment: (
            <ShiftedInputAdornment position="start">
              <RevertButton
                onRevert={onRevert}
                disabled={field.value === defaultValues[name]}
              />
            </ShiftedInputAdornment>
          ),
        },
      })}
    >
      <MenuItem key={`${name}-empty`} value="">
        {t("selectNoChoice")}
      </MenuItem>
      {items.map((item) => (
        <MenuItem key={`${name}-${item[keyField]}`} value={item[keyField]}>
          {item[nameField]}
        </MenuItem>
      ))}
    </StyledTextField>
  )
}
