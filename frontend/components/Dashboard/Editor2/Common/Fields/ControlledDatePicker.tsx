import { useCallback } from "react"

import { omit } from "lodash"
import { useRouter } from "next/router"
import { useFormContext } from "react-hook-form"

import { TextField, TextFieldProps } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

export function ControlledDatePicker(props: ControlledFieldProps) {
  const { locale } = useRouter()
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

  const value = watch([name])

  const renderDatePickerComponent = useCallback(
    () => (
      <DatePicker
        value={value}
        onChange={onChange}
        onClose={onCloseDatePicker}
        label={label}
        renderInput={renderDatePickerInput}
      />
    ),
    [name, label, onChange, value, renderDatePickerInput, onCloseDatePicker],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
      <FieldController
        {...omit(props, "validateOtherFields")}
        style={{ marginBottom: "1.5rem" }}
        renderComponent={renderDatePickerComponent}
      />
    </LocalizationProvider>
  )
}
