import { Controller, useFormContext } from "react-hook-form"
import notEmpty from "/util/notEmpty"

export const ControlledHiddenField = ({
  name,
  defaultValue,
}: {
  name: string
  defaultValue: any
}) => {
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
