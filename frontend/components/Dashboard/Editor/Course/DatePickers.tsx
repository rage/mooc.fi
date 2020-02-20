import React from "react"
import { DatePicker } from "@material-ui/pickers"
import { FieldProps, ErrorMessage } from "formik"
import styled from "styled-components"

const StyledErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`

const DatePickerField = ({ field, form, ...others }: FieldProps) => {
  return (
    <>
      <DatePicker
        value={field.value === "" ? null : field.value}
        onChange={value => form.setFieldValue(field.name, value)}
        format="yyyy-MM-dd"
        {...others}
        style={{ marginBottom: "1.5rem", width: "70%" }}
        onClose={() => form.setFieldTouched(field.name)}
      />
      <StyledErrorMessage>
        <ErrorMessage name={field.name} />
      </StyledErrorMessage>
    </>
  )
}

export default DatePickerField
