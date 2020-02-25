import React from "react"
import { DatePicker } from "@material-ui/pickers"
import { FieldProps, ErrorMessage } from "formik"
import styled from "styled-components"
import { DateTime } from "luxon"

const StyledErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 3px;
  margin-left: 14px;
  margin-right: 14px;
  text-align: left;
  line-height: 1.66;
`

const DatePickerField = ({ field, form, ...others }: FieldProps) => {
  return (
    <>
      <DatePicker
        value={field.value === "" ? null : field.value}
        onChange={(value: DateTime | null) =>
          form.setFieldValue(field.name, value)
        }
        format="yyyy-MM-dd"
        style={{
          marginBottom: form.errors[field.name] ? "0rem" : "1.5rem",
          width: "70%",
        }}
        onClose={() => form.setFieldTouched(field.name)}
        {...others}
      />
      <ErrorMessage component={StyledErrorMessage} name={field.name} />
    </>
  )
}

export default DatePickerField
