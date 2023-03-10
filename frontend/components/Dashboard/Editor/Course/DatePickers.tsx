import { useCallback } from "react"

import { ErrorMessage, useField } from "formik"

import { TextField } from "@mui/material"
import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

const StyledErrorMessage = styled("p")`
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 3px;
  margin-left: 14px;
  margin-right: 14px;
  text-align: left;
  line-height: 1.66;
`

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>`
  margin-bottom: ${(props) => (props.error ? "0rem" : "1.5rem")};
  width: 70%;
`

function DatePickerField(props: any) {
  const [fieldInputProps, { error }, { setValue, setTouched }] = useField(props)

  const TextFieldComponent = useCallback(
    (props: any) => <StyledTextField error={error} {...props} />,
    [error],
  )

  const onChange = useCallback((value: any) => setValue(value), [setValue])
  const onClose = useCallback(() => setTouched(true), [setTouched])

  return (
    <>
      <DatePicker
        {...fieldInputProps}
        {...props}
        format="yyyy-MM-dd"
        onChange={onChange}
        onClose={onClose}
        slots={{
          textField: TextFieldComponent,
        }}
      />
      <ErrorMessage
        component={StyledErrorMessage}
        name={fieldInputProps.name}
      />
    </>
  )
}

export default DatePickerField
