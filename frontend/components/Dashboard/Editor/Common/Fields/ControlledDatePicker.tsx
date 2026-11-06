import React, { useCallback } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { FieldValues, useController, useFormContext } from "react-hook-form"

import { Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { PickersTextField } from "@mui/x-date-pickers/PickersTextField"

import { ControlledFieldProps } from "."
import { pulseAnimation } from ".."
import { useAnchor } from "/hooks/useAnchors"

const DatePickerTextField = styled(PickersTextField)`
  margin-bottom: 1rem;

  ${pulseAnimation}
`

const DynamicDatePicker = dynamic(
  () => import("@mui/x-date-pickers/DatePicker").then((mod) => mod.DatePicker),
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

  const { field, fieldState } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={locale}>
      <DynamicDatePicker
        value={field.value}
        onChange={
          field.onChange as Exclude<DatePickerProps["onChange"], undefined>
        }
        onClose={onCloseDatePicker}
        label={label}
        inputRef={(el: HTMLInputElement | null) => {
          field.ref(el)
          anchor.ref(el)
        }}
        slotProps={{
          textField: {
            variant: "outlined",
            error: fieldState.invalid,
            onBlur: onCloseDatePicker,
            helperText: fieldState.error?.message,
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
