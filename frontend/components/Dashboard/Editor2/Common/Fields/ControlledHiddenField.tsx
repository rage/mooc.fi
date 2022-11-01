import { Controller, useFormContext } from "react-hook-form"

import { FieldProps } from "."
import notEmpty from "/util/notEmpty"

interface ControlledHiddenFieldProps extends FieldProps {}

export const ControlledHiddenField = ({
  name,
  defaultValue,
}: ControlledHiddenFieldProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      {...(notEmpty(defaultValue) ? { defaultValue } : {})}
      render={(props) => <input type="hidden" {...props} />}
    />
  )
}
