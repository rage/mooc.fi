import { useCallback } from "react"

import {
  ControllerRenderProps,
  FieldValues,
  PathValue,
  useFormContext,
} from "react-hook-form"

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

  const onChange = useCallback(
    (_: any, newValue: string) =>
      setValue(name, newValue as PathValue<T, typeof name>, {
        shouldDirty: true,
      }),
    [name, setValue],
  )

  const renderRadioGroup = useCallback(
    ({ value }: ControllerRenderProps<T>) => (
      <RadioGroup aria-label={label} value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={`${name}-${option.value}`}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    ),
    [name, label, options, onChange, setValue],
  )

  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={renderRadioGroup}
    />
  )
}
