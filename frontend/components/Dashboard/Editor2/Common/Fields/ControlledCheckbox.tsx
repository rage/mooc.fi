import { useCallback } from "react"

import {
  ControllerRenderProps,
  FieldValues,
  PathValue,
  useFormContext,
} from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import { Checkbox, FormControlLabel, Tooltip } from "@mui/material"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"

export function ControlledCheckbox<T extends FieldValues>(
  props: ControlledFieldProps<T>,
) {
  const { name, label, tip } = props
  const { setValue } = useFormContext<T>()

  const onChange = useCallback(
    (_: any, checked: boolean) =>
      setValue(name, checked as PathValue<T, typeof name>),
    [name, setValue],
  )

  const renderCheckboxComponent = useCallback(
    ({ value }: ControllerRenderProps<T>) => (
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
    ),
    [name, label, tip, onChange],
  )

  return (
    <FieldController
      name={name}
      label={label}
      renderComponent={renderCheckboxComponent}
    />
  )
}
