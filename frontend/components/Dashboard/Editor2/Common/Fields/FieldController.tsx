import { useCallback } from "react"
import { ControllerRenderProps, useFormContext } from "react-hook-form"
import { FieldProps } from "."
import { Controller } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { EnumeratingAnchor } from "/components/Dashboard/Editor2/Common"
import { FormHelperText } from "@material-ui/core"
import notEmpty from "/util/notEmpty"

export interface FieldControllerProps extends FieldProps {
  renderComponent: (props: ControllerRenderProps) => JSX.Element
  onChange?: (e: any, newValue: any) => {}
}

export function FieldController({
  name,
  label,
  required = false,
  defaultValue,
  renderComponent,
  ...props
}: FieldControllerProps & React.HTMLProps<HTMLDivElement>) {
  const { control, errors, setValue } = useFormContext()

  const onChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(name, target.value, { shouldValidate: true }),
    [name],
  )

  return (
    <Controller
      name={name}
      control={control}
      autoComplete="disabled"
      {...(notEmpty(defaultValue) ? { defaultValue } : {})}
      render={(renderProps) => (
        <div {...props}>
          <EnumeratingAnchor id={name} />
          {renderComponent({ ...renderProps, onChange })}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
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
