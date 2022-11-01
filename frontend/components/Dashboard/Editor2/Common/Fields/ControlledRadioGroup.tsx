import { FieldValues, PathValue, useFormContext } from "react-hook-form"

import { FormControlLabel, Radio, RadioGroup } from "@mui/material"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

interface ControlledRadioGroupProps<T extends FieldValues>
  extends ControlledFieldProps<T> {
  options: Array<{ value: string; label: string }>
}

export function ControlledRadioGroup<T extends FieldValues>(
  props: ControlledRadioGroupProps<T>,
) {
  const { label, options } = props
  const name = props.name
  const { setValue } = useFormContext<T>()
  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={({ value }) => (
        <RadioGroup
          aria-label={label}
          value={value}
          onChange={(_, newValue) =>
            setValue(name, newValue as PathValue<T, typeof name>, {
              shouldDirty: true,
            })
          }
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
      )}
    />
  )
}
