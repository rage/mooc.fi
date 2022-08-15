import {
  Path,
  PathValue,
  UnpackNestedValue,
  useFormContext,
} from "react-hook-form"

import { FormControlLabel, Radio, RadioGroup } from "@mui/material"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

interface ControlledRadioGroupProps extends ControlledFieldProps {
  options: Array<{ value: string; label: string }>
}

export function ControlledRadioGroup<T>(props: ControlledRadioGroupProps) {
  const { label, options } = props
  const name = props.name as Path<T>
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
            setValue(
              name,
              newValue as UnpackNestedValue<PathValue<T, Path<T>>>,
              { shouldDirty: true },
            )
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
