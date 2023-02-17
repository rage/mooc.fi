import React, { useCallback } from "react"

import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  Message,
  MultipleFieldErrors,
  PathValue,
  useFormContext,
} from "react-hook-form"

import { ErrorMessage } from "@hookform/error-message"
import { FormHelperText } from "@mui/material"

import { FieldProps, LabeledFieldProps, RequiredFieldProps } from "."
import { EnumeratingAnchor } from ".."
import notEmpty from "/util/notEmpty"

export interface FieldControllerProps<T extends FieldValues>
  extends FieldProps<T>,
    LabeledFieldProps,
    RequiredFieldProps {
  renderComponent: (props: ControllerRenderProps<T>) => JSX.Element
  onChange?: (e: any, newValue: PathValue<T, FieldProps<T>["name"]>) => void
}

interface ErrorMessageComponentProps {
  message: Message
  messages?: MultipleFieldErrors
}

const ErrorMessageComponent = ({ message }: ErrorMessageComponentProps) => (
  <FormHelperText style={{ color: "#f44336" }}>{message}</FormHelperText>
)

interface FieldControllerRenderedElementProps<T extends FieldValues> {
  field: ControllerRenderProps<T>
}

export function FieldController<T extends FieldValues>({
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
      setValue(name, target.value as PathValue<T, typeof name>, {
        shouldValidate: true,
      }),
    [name],
  )

  const renderElement = useCallback(
    (renderProps: FieldControllerRenderedElementProps<T>) => (
      <div {...props}>
        <EnumeratingAnchor id={name} />
        <ErrorMessage
          errors={errors}
          name={name as any} // TODO/FIXME: annoying typing here
          render={ErrorMessageComponent}
        />
        {renderComponent({ ...renderProps.field, onChange })}
      </div>
    ),
    [name, renderComponent, props, errors, onChange],
  )

  return (
    <Controller<T>
      name={name}
      control={control}
      // autoComplete="disabled"
      {...(notEmpty(defaultValue) ? { defaultValue } : {})}
      render={renderElement}
    />
  )
}
