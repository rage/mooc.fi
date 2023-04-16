import { useField } from "formik"

import { TextField } from "@mui/material"
import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

const DatePickerTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "hasError",
})<{ hasError?: boolean }>`
  width: 70%;
  margin-bottom: ${(props) => (props.hasError ? "0rem" : "1.5rem")};
`

const DatePickerField = ({ ...props }: any) => {
  const [fieldInputProps, { error }, { setValue, setTouched }] = useField(props)

  return (
    <>
      <DatePicker
        {...fieldInputProps}
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
    </>
  )
}

export default DatePickerField
