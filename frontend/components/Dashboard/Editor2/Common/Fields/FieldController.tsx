import React, { useCallback } from "react"

import {
  Controller,
  ControllerRenderProps,
  Message,
  MultipleFieldErrors,
  Path,
  useFormContext,
} from "react-hook-form"

import { ErrorMessage } from "@hookform/error-message"
import { FormHelperText } from "@mui/material"

import { FieldProps } from "."
import { FormValues } from "../../types"
import { EnumeratingAnchor } from "/components/Dashboard/Editor2/Common"
import notEmpty from "/util/notEmpty"

export interface FieldControllerProps<T extends FormValues> extends FieldProps {
  renderComponent: (props: ControllerRenderProps<T>) => JSX.Element
  onChange?: (e: any, newValue: any) => any
}

interface FieldControllerRenderedElementProps<T extends FormValues> {
  field: ControllerRenderProps<T>
}

interface ErrorMessageComponentProps {
  message: Message
  messages?: MultipleFieldErrors
}

const ErrorMessageComponent = ({ message }: ErrorMessageComponentProps) => (
  <FormHelperText style={{ color: "#f44336" }}>{message}</FormHelperText>
)

export function FieldController<T extends FormValues>({
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

  const renderElement = useCallback(
    (renderProps: FieldControllerRenderedElementProps<T>) => (
      <div {...props}>
        <EnumeratingAnchor id={name} />
        {renderComponent({ ...renderProps.field, onChange })}
        <ErrorMessage
          errors={errors}
          name={name as any} // TODO/FIXME: annoying typing here
          render={ErrorMessageComponent}
        />
      </div>
    ),
    [name, renderComponent, props, errors, onChange],
  )

  return (
    <Controller<T>
      name={name as Path<T>}
      control={control}
      // autoComplete="disabled"
      {...(notEmpty(defaultValue) ? { defaultValue } : {})}
      render={renderElement}
    />
  )
}
