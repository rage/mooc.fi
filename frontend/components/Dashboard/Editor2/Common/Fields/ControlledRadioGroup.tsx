import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import { useFormContext } from "react-hook-form"
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core"

interface ControlledRadioGroupProps extends ControlledFieldProps {
  options: Array<{ value: string; label: string }>
}
export function ControlledRadioGroup(props: ControlledRadioGroupProps) {
  const { name, label, options } = props
  const { setValue } = useFormContext()
  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={({ value }) => (
        <RadioGroup
          aria-label={label}
          value={value}
          onChange={(_, newValue) =>
            setValue(name, newValue, { shouldDirty: true })
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
