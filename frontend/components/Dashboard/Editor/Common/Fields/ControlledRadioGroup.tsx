import { FieldPath, FieldValues, useController } from "react-hook-form"

import { FormControlLabel, Radio, RadioGroup } from "@mui/material"

import { ControlledFieldProps } from "."

interface ControlledRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControlledFieldProps<TFieldValues, TName> {
  options: Array<{ value: string; label: string }>
}

export function ControlledRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledRadioGroupProps<TFieldValues, TName>) {
  const { label, options, name, required } = props

  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  return (
    <RadioGroup
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
  )
}
