import {
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPathValue,
  FieldValues,
  Path,
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
  T extends FieldValues = FieldValues,
  TPath extends Path<T> = Path<T>,
> {
  name: TPath
  defaultValue?: FieldPathValue<T, TPath>
}

export interface FieldArrayProps<
  T extends FieldValues = FieldValues,
  TPath extends FieldArrayPath<T> = FieldArrayPath<T>,
> {
  name: TPath
  defaultValue?: FieldArrayPathValue<T, TPath>
}

interface BaseControlledFieldProps {
  tip?: string
  revertable?: boolean
}
export interface ControlledFieldProps<
  T extends FieldValues = FieldValues,
  TPath extends Path<T> = Path<T>,
> extends FieldProps<T, TPath>,
    BaseControlledFieldProps,
    LabeledFieldProps,
    RequiredFieldProps {
  validateOtherFields?: Array<TPath>
}

export interface ControlledFieldArrayProps<
  T extends FieldValues = FieldValues,
  TPath extends FieldArrayPath<T> = FieldArrayPath<T>,
> extends FieldArrayProps<T, TPath>,
    BaseControlledFieldProps,
    LabeledFieldProps,
    RequiredFieldProps {
  validateOtherFields?: Array<TPath>
}
