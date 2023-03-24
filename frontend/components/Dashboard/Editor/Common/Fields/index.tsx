import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldPathValue,
  FieldValues,
  FormState,
} from "react-hook-form"

export * from "./ControlledCheckbox"
export * from "./ControlledDatePicker"
export * from "./ControlledFieldArrayList"
export * from "./ControlledHiddenField"
export * from "./ControlledImageInput"
export * from "./ControlledModuleList"
export * from "./ControlledRadioGroup"
export * from "./ControlledSelect"
export * from "./ControlledTextField"
export * from "./FieldController"

export interface LabeledFieldProps {
  label: string
}

export interface RequiredFieldProps {
  required?: boolean
}

export interface FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName
  defaultValue?: FieldPathValue<TFieldValues, TName>
}

export interface FieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> {
  name: TName
  defaultValue?: FieldArrayPathValue<TFieldValues, TName>
}

interface BaseControlledFieldProps {
  tip?: string
  revertable?: boolean
}

export interface ControlledFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FieldProps<TFieldValues, TName>,
    BaseControlledFieldProps,
    LabeledFieldProps,
    RequiredFieldProps {
  validateOtherFields?: Array<TName>
}

export interface ControlledFieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> extends FieldArrayProps<TFieldValues, TName>,
    BaseControlledFieldProps,
    LabeledFieldProps,
    RequiredFieldProps {
  validateOtherFields?: Array<TName>
}