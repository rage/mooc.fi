import { FieldPath, FieldValues, useController } from "react-hook-form"

import { FieldProps } from "."

export const ControlledHiddenField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  defaultValue,
}: FieldProps<TFieldValues, TName>) => {
  const { field } = useController<TFieldValues>({
    name,
    defaultValue,
  })

  return (
    <input
      type="hidden"
      name={field.name}
      value={field.value}
      ref={field.ref}
    />
  )
}
