import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import HelpIcon from "@mui/icons-material/Help"
import { FormControlLabel, Checkbox, Tooltip } from "@mui/material"
import {
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
  useFormContext,
} from "react-hook-form"

export function ControlledCheckbox<T>(props: ControlledFieldProps) {
  const { name, label, tip } = props
  const { setValue } = useFormContext()

  const onChange = (_: any, checked: boolean) =>
    setValue(
      name,
      checked as UnpackNestedValue<PathValue<FieldValues, Path<T>>>,
    )

  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={({ value }) => (
        <div>
          <FormControlLabel
            key={name}
            label={label}
            value={value}
            checked={Boolean(value)}
            onChange={onChange}
            control={<Checkbox />}
          />
          {tip ? (
            <Tooltip title={tip} style={{ verticalAlign: "middle" }}>
              <HelpIcon />
            </Tooltip>
          ) : null}
        </div>
      )}
    />
  )
}
