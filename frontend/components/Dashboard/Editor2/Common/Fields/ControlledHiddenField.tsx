import { omit } from "lodash"
import { Controller, useFormContext } from "react-hook-form"

import notEmpty from "/util/notEmpty"

interface ControlledHiddenFieldProps {
  name: string
  defaultValue: any
}

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
      render={(props) => (
        <input type="hidden" {...omit(props, ["formState", "fieldState"])} />
      )}
    />
  )
}
