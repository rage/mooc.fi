import { useCallback } from "react"

import {
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValue,
  Path,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form"

import { MenuItem, TextField } from "@mui/material"

import { FormValues } from "../../types"
import {
  ControlledFieldProps,
  FieldController,
} from "."
import CommonTranslations from "/translations/common"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"

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
  const { label, items, keyField = "id", nameField = "name", name } = props
  const { formState } = useFormContext<TFieldValues>()
  const { errors } = formState
  const { field } = useController<TFieldValues>({
    name,
  })

  /*return (
    <FieldController
      name={name}
      label={label}
      defaultValue={watch(name) ?? ("" as PathValue<TFieldValues, TName>)}
      renderComponent={renderSelect}
      formState={formState}
    />
  )*/
  return (
    <TextField
      select
      variant="outlined"
      label={label}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      error={Boolean(flattenKeys(errors as Record<string, any>)[name])}
      style={{ marginTop: "1.5rem" }}
    >
      <MenuItem key={`${name}-empty`} value="">
        {t("selectNoChoice")}
      </MenuItem>
      {items.map((item) => (
        <MenuItem key={`${name}-${item[keyField]}`} value={`${item[keyField]}`}>
          {item[nameField]}
        </MenuItem>
      ))}
    </TextField>
  )
}
