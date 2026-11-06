import { useField } from "formik"

import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { PickersTextField } from "@mui/x-date-pickers/PickersTextField"

const DatePickerTextField = styled(PickersTextField, {
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
