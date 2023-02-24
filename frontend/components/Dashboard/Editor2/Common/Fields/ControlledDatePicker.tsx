import { useCallback } from "react"

import { useRouter } from "next/router"
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form"

import { TextField, TextFieldProps, Theme, useMediaQuery } from "@mui/material"
import {
  DesktopDatePicker,
  LocalizationProvider,
  MobileDatePicker,
} from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

export function ControlledDatePicker(props: ControlledFieldProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"))
  const DatePicker = isMobile ? MobileDatePicker : DesktopDatePicker
  const { locale } = useRouter()
  const { watch, setValue, trigger } = useFormContext()
  const { name, label, validateOtherFields = [] } = props

  const onChange = useCallback(
    (date: any) =>
      setValue(name, date, { shouldValidate: true, shouldDirty: true }),
    [name, setValue],
  )

  const onCloseDatePicker = useCallback(
    () => trigger([name, ...validateOtherFields]),
    [name, trigger, validateOtherFields],
  )

  const renderDatePickerInput = useCallback((props: TextFieldProps) => {
    return <TextField {...props} variant="outlined" />
  }, [])

  const renderDatePickerComponent = useCallback(
    ({ value, onChange }: ControllerRenderProps<FieldValues, string>) => (
      <DatePicker
        value={value}
        onChange={onChange}
        onClose={onCloseDatePicker}
        label={label}
        renderInput={renderDatePickerInput}
        disableMaskedInput
      />
    ),
    [
      isMobile,
      name,
      label,
      watch,
      onChange,
      renderDatePickerInput,
      onCloseDatePicker,
    ],
  )

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
      <FieldController
        name={name}
        label={label}
        style={{ marginBottom: "1.5rem" }}
        renderComponent={renderDatePickerComponent}
      />
    </LocalizationProvider>
  )
}
