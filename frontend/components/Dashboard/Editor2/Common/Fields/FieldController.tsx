import React, { useCallback } from "react"
import { ControllerRenderProps, Path, useFormContext } from "react-hook-form"
import { FieldProps } from "."
import { Controller } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { EnumeratingAnchor } from "/components/Dashboard/Editor2/Common"
import { FormHelperText } from "@material-ui/core"
import notEmpty from "/util/notEmpty"

export interface FieldControllerProps<T> extends FieldProps {
  renderComponent: (props: ControllerRenderProps<T>) => JSX.Element
  onChange?: (e: any, newValue: any) => {}
}

export function FieldController<T>({
  name,
  label,
  required = false,
  defaultValue,
  renderComponent,
  ...props
}: FieldControllerProps<T> & React.HTMLProps<HTMLDivElement>) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<T>()

  const onChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(name as Path<T>, target.value as any, { shouldValidate: true }),
    [name],
  )

  return (
    <Controller<T>
      name={name as Path<T>}
      control={control}
      // autoComplete="disabled"
      {...(notEmpty(defaultValue) ? { defaultValue } : {})}
      render={(renderProps) => (
        <div {...props}>
          <EnumeratingAnchor id={name} />
          {renderComponent({ ...renderProps.field, onChange })}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }: { message: string | React.ReactElement }) => (
              <FormHelperText style={{ color: "#f44336" }}>
                {message}
              </FormHelperText>
            )}
          />
        </div>
      )}
    />
  )
}
