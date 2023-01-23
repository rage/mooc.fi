import { omit } from "lodash"
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"

import { DefaultFieldRenderProps, FieldProps } from "."
import notEmpty from "/util/notEmpty"

const ControlledHiddenFieldInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: DefaultFieldRenderProps<TFieldValues, TName>,
) => <input type="hidden" {...omit(props, ["formState", "fieldState"])} />

export const ControlledHiddenField = ({ name, defaultValue }: FieldProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      {...(notEmpty(defaultValue) ? { defaultValue } : {})}
      render={ControlledHiddenFieldInput}
    />
  )
}
