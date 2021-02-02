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

export interface FieldProps {
  name: string
  label: string
  required?: boolean
  defaultValue?: any
}

export interface ControlledFieldProps extends FieldProps {
  tip?: string
  validateOtherFields?: Array<string>
  revertable?: boolean
}
