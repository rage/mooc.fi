import React from "react"
import { DatePicker } from "@material-ui/pickers"
import { FieldProps } from "formik"

const DatePickerField = ({ field, form, ...others }: FieldProps) => {
  return (
    <DatePicker
      value={field.value === "" ? null : field.value}
      onChange={value => form.setFieldValue(field.name, value)}
      format="yyyy-mm-dd"
      {...others}
      style={{ marginBottom: "1.5rem", width: "50%" }}
    />
  )
}

export default DatePickerField
