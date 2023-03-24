import React, { useCallback } from "react"

import {
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  FormState,
  Message,
  MultipleFieldErrors,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form"

import { ErrorMessage } from "@hookform/error-message"
import { FormHelperText } from "@mui/material"

import { FieldProps, LabeledFieldProps, RequiredFieldProps } from "."
import { EnumeratingAnchor } from ".."
import notEmpty from "/util/notEmpty"

export interface FieldControllerProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends FieldProps<TFieldValues, TName>,
    LabeledFieldProps,
    RequiredFieldProps {
  renderComponent: (
    props: ControllerRenderProps<TFieldValues, TName>,
  ) => JSX.Element
  onChange?: (e: any, newValue: PathValue<TFieldValues, TName>) => void
  formState: FormState<TFieldValues>
}

interface ErrorMessageComponentProps {
  message: Message
  messages?: MultipleFieldErrors
}

const ErrorMessageComponent = ({ message }: ErrorMessageComponentProps) => (
  <FormHelperText style={{ color: "#f44336", marginTop: "-1rem" }}>
    {message}
  </FormHelperText>
)

interface FieldControllerRenderedElementProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  field: ControllerRenderProps<TFieldValues, TName>
}

const FieldControllerComponent = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    name,
    label,
    required = false,
    defaultValue,
    renderComponent,
    formState,
    ...props
  }: FieldControllerProps<TFieldValues, TName> & React.HTMLProps<HTMLDivElement>) => {
    // const { control, setValue } = useFormContext<TFieldValues>()

    /*const onChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(name, target.value as PathValue<T, typeof name>, {
        shouldValidate: true,
      }),
    [name],
  )*/

    const renderElement = useCallback(
      (renderProps: FieldControllerRenderedElementProps<TFieldValues, TName>) => (
        <div>
          <EnumeratingAnchor id={name} />
          {renderComponent({ ...renderProps.field })}
          {/*<ErrorMessage
            errors={formState?.errors}
            name={(name as any)} // TODO/FIXME: annoying typing here
            render={ErrorMessageComponent}
      />*/}
        </div>
      ),
      [name, renderComponent, /*props,*/ formState],
    )

    const { field } = useController({
      name,
      defaultValue,
      rules: { required }
    })
    return (
      <>
        {renderComponent({ ...field })}
      </>
    )
    /*return (
      <Controller<TFieldValues, TName>
        name={name}
        control={control}
        // autoComplete="disabled"
        {...(notEmpty(defaultValue) ? { defaultValue } : {})}
        render={renderElement}
      />
    )*/
  }

export const FieldController = React.memo(
  FieldControllerComponent,
  (prevProps, nextProps) =>
    prevProps.formState?.isDirty === nextProps.formState?.isDirty,
) as typeof FieldControllerComponent
