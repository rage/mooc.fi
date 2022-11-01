import { Path, PathValue, useFormContext } from "react-hook-form"

import { MenuItem, TextField } from "@mui/material"

import { FormValues } from "../../types"
import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import CommonTranslations from "/translations/common"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"

interface ControlledSelectProps<
  T extends FormValues,
  TPath extends Path<T> = Path<T>,
> extends ControlledFieldProps<T, TPath> {
  items: Array<T[TPath]>
  keyField?: Path<T[TPath]>
  nameField?: Path<T[TPath]>
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    value?: any,
  ) => void
}

export function ControlledSelect<
  T extends FormValues,
  TPath extends Path<T> = Path<T>,
>(props: ControlledSelectProps<T, TPath>) {
  const t = useTranslator(CommonTranslations)
  const { label, items, keyField = "id", nameField = "name", onChange } = props
  const name = props.name
  const { watch, setValue, trigger, formState } = useFormContext<T>()
  const { errors } = formState

  const _onChange = onChange
    ? onChange
    : (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(
          name,
          (e.target.value !== "_empty" ? e.target.value : "") as PathValue<
            T,
            typeof name
          >,
          {
            shouldDirty: true,
            shouldValidate: true,
          },
        )
        trigger(name)
      }

  return (
    <FieldController
      name={name}
      label={label}
      defaultValue={watch(name) ?? ("_empty" as PathValue<T, typeof name>)}
      renderComponent={({ value }) => (
        <TextField
          select
          variant="outlined"
          label={label}
          value={value !== "" ? value : "_empty"}
          error={Boolean(flattenKeys(errors as Record<string, any>)[name])}
          onChange={_onChange}
          style={{ marginTop: "1.5rem" }}
        >
          <MenuItem key={`${name}-empty`} value="_empty">
            {t("selectNoChoice")}
          </MenuItem>
          {items.map((item) => (
            <MenuItem
              key={`${name}-${item[keyField]}`}
              value={`${item[keyField]}`}
            >
              {item[nameField]}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
