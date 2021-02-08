import { useFormContext } from "react-hook-form"
import { TextField, MenuItem } from "@material-ui/core"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"
import CommonTranslations from "/translations/common"
import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

interface ControlledSelectProps<T> extends ControlledFieldProps {
  items: T[]
  keyField?: keyof T
  nameField?: keyof T
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    value?: any,
  ) => void
}
export function ControlledSelect<T extends { [key: string]: any }>(
  props: ControlledSelectProps<T>,
) {
  const t = useTranslator(CommonTranslations)
  const {
    name,
    label,
    items,
    keyField = "id" as keyof T,
    nameField = "name" as keyof T,
    onChange,
  } = props
  const { watch, setValue, trigger, formState } = useFormContext()
  const { errors } = formState

  const _onChange = onChange
    ? onChange
    : (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setValue(name, e.target.value !== "_empty" ? e.target.value : "", {
          shouldDirty: true,
          shouldValidate: true,
        })
        trigger(name)
      }

  return (
    <FieldController
      name={name}
      label={label}
      defaultValue={watch(name) ?? "_empty"}
      renderComponent={({ value }) => (
        <TextField
          select
          variant="outlined"
          label={label}
          value={value !== "" ? value : "_empty"}
          error={Boolean(flattenKeys(errors)[name])}
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
