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

const DatePickerTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "hasError",
})<{ hasError?: boolean }>`
  width: 70%;
  margin-bottom: ${(props) => (props.hasError ? "0rem" : "1.5rem")};
`

const DatePickerField = ({ ...props }: any) => {
  const [field, { error }, { setValue, setTouched }] = useField(props)

  return (
    <>
      <DatePicker
        {...field}
        {...props}
        format="yyyy-MM-dd"
        mask="____-__-__"
        onChange={setValue}
        onClose={setTouched}
        slotProps={{
          textField: {
            hasError: Boolean(error),
          },
        }}
        slots={{
          textField: DatePickerTextField,
        }}
      />
      <ErrorMessage component={StyledErrorMessage} name={field.name} />
    </>
  )
}

export default DatePickerField
