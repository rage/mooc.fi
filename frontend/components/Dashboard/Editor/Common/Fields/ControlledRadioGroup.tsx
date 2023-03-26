import React from "react"

import { FieldPath, FieldValues, useController } from "react-hook-form"

import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material"

import { ControlledFieldProps } from "."
import { useErrorMessage } from ".."
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"

interface ControlledRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControlledFieldProps<TFieldValues, TName> {
  options: Array<{ value: string; label: string }>
}

function ControlledRadioGroupImpl<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledRadioGroupProps<TFieldValues, TName>) {
  const { label, options, name, required } = props
  const anchor = useAnchor(name)

  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const { error, hasError } = useErrorMessage(name)

  return (
    <FormControl
      required={required}
      error={hasError}
      component="fieldset"
      ref={(el) => {
        field.ref(el)
        anchor.ref(el)
      }}
    >
      <FormLabel id={name} component="legend" error={hasError}>
        {label}
      </FormLabel>
      <RadioGroup
        id={name}
        aria-label={label}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
      >
        {options.map((option) => (
          <FormControlLabel
            key={`${name}-${option.value}`}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  )
}

export const ControlledRadioGroup = React.memo(
  ControlledRadioGroupImpl,
) as typeof ControlledRadioGroupImpl
