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
import { useCourseEditorData } from "../../Course/CourseEditorDataContext"
import { FormValues } from "../../types"
import RevertButton from "/components/RevertButton"
import { useAnchor } from "/hooks/useAnchors"
import { useTranslator } from "/hooks/useTranslator"
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
  const anchor = useAnchor(name)
  const { field, fieldState } = useController<TFieldValues>({
    name,
    rules: { required },
  })

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
      error={fieldState.invalid}
      helperText={fieldState.error?.message}
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
      <MenuItem key="empty" value="">
        {t("selectNoChoice")}
      </MenuItem>
      {items.map((item) => (
        <MenuItem key={item[keyField]} value={item[keyField]}>
          {item[nameField]}
        </MenuItem>
      ))}
    </StyledTextField>
  )
}
