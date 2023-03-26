import { useCallback } from "react"
import React from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FieldValues, useController, useFormContext } from "react-hook-form"

import { Skeleton, TextField, TextFieldProps } from "@mui/material"
import { styled } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"

import { ControlledFieldProps } from "."
import { useErrorMessage } from ".."
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const DatePickerTextField = (props: TextFieldProps) => (
  <StyledTextField {...props} variant="outlined" />
)

const DynamicDatePicker = dynamic(
  () => import("@mui/x-date-pickers").then((mod) => mod.DatePicker),
  { ssr: false, loading: () => <Skeleton variant="rectangular" /> },
)

function ControlledDatePickerImpl<
  TFieldValues extends FieldValues = FieldValues,
>(props: ControlledFieldProps<TFieldValues>) {
  const { locale } = useRouter()
  const { trigger } = useFormContext<TFieldValues>()
  const { name, label, required, validateOtherFields = [] } = props
  const anchor = useAnchor(name)

  const onCloseDatePicker = useCallback(
    () => trigger([name, ...validateOtherFields]),
    [name, trigger, validateOtherFields],
  )

  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })
  const { hasError, error } = useErrorMessage(name)

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
      <DynamicDatePicker
        value={field.value}
        onChange={field.onChange}
        onClose={onCloseDatePicker}
        label={label}
        slotProps={{
          textField: {
            inputRef: (el) => {
              field.ref(el)
              anchor.ref(el)
            }, //field.ref,
            error: hasError,
            onBlur: onCloseDatePicker,
            helperText: error,
            required: required,
          },
        }}
        slots={{
          textField: DatePickerTextField,
        }}
      />
    </LocalizationProvider>
  )
}

export const ControlledDatePicker = React.memo(
  ControlledDatePickerImpl,
) as typeof ControlledDatePickerImpl
