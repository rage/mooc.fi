import { useCallback } from "react"

import { omit } from "lodash"
import { useFormContext } from "react-hook-form"

import { TextField, TextFieldProps } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

export function ControlledDatePicker(props: ControlledFieldProps) {
  const { watch, setValue, trigger } = useFormContext()
  const { name, label, validateOtherFields = [] } = props

  const onChange = useCallback(
    (date: any) => {
      setValue(name, date, { shouldValidate: true, shouldDirty: true })
      return { value: date }
    },
    [name, setValue],
  )

  const onCloseDatePicker = useCallback(
    () => trigger([name, ...validateOtherFields]),
    [name, trigger, validateOtherFields],
  )

  const renderDatePickerInput = useCallback(
    (props: TextFieldProps) => <TextField {...props} variant="outlined" />,
    [],
  )

  const renderDatePickerComponent = useCallback(
    () => (
      <DatePicker
        value={watch([name])}
        onChange={onChange}
        onClose={onCloseDatePicker}
        label={label}
        renderInput={renderDatePickerInput}
      />
    ),
    [name, label, onChange, watch, renderDatePickerInput, onCloseDatePicker],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <FieldController
        {...omit(props, "validateOtherFields")}
        style={{ marginBottom: "1.5rem" }}
        renderComponent={renderDatePickerComponent}
      />
    </LocalizationProvider>
  )
}
