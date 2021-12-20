import { omit } from "lodash"
import { useFormContext } from "react-hook-form"
import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import DatePicker from "@mui/lab/DatePicker"
import { TextField } from "@mui/material"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterLuxon from "@mui/lab/AdapterLuxon"

export function ControlledDatePicker(props: ControlledFieldProps) {
  const { watch, setValue, trigger } = useFormContext()
  const { name, label, validateOtherFields = [] } = props

  const onChange = (date: any) => {
    setValue(name, date, { shouldValidate: true, shouldDirty: true })
    return { value: date }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FieldController
        {...omit(props, "validateOtherFields")}
        style={{ marginBottom: "1.5rem" }}
        renderComponent={() => (
          <DatePicker
            value={watch(name)}
            onChange={onChange}
            onClose={() => trigger([name, ...validateOtherFields])}
            label={label}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" />
            )}
          />
        )}
      />
    </LocalizationProvider>
  )
}
