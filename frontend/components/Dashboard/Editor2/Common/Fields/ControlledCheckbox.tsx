import { useFormContext } from "react-hook-form"
import { FormControlLabel, Checkbox } from "@material-ui/core"
import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

export function ControlledCheckbox(props: ControlledFieldProps) {
  const { name, label } = props
  const { setValue } = useFormContext()

  const onChange = (_: any, checked: boolean) => setValue(name, checked)

  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={({ value }) => (
        <FormControlLabel
          key={name}
          label={label}
          value={value}
          checked={Boolean(value)}
          onChange={onChange}
          control={<Checkbox />}
        />
      )}
    />
  )
}
