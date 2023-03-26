import { FieldPath, PathValue, useController } from "react-hook-form"

import { MenuItem, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { useErrorMessage } from ".."
import { FormValues } from "../../types"
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"
import { useTranslator } from "/hooks/useTranslator"
import useWhyDidYouUpdate from "/lib/why-did-you-update"
import CommonTranslations from "/translations/common"

const StyledTextField = styled(TextField)`
  margin-top: 1.5rem;
`

interface ControlledSelectProps<
  TFieldValues extends FormValues = FormValues,
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
  const {
    label,
    items,
    required,
    keyField = "id",
    nameField = "name",
    name,
  } = props
  useWhyDidYouUpdate(`ControlledSelect ${name}`, props)
  const anchor = useAnchor(name)
  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const { error, hasError } = useErrorMessage(name)

  return (
    <StyledTextField
      select
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
    >
      <MenuItem key={`${name}-empty`} value="">
        {t("selectNoChoice")}
      </MenuItem>
      {items.map((item) => (
        <MenuItem key={`${name}-${item[keyField]}`} value={`${item[keyField]}`}>
          {item[nameField]}
        </MenuItem>
      ))}
    </StyledTextField>
  )
}
