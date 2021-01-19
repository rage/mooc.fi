import DatePicker from "@material-ui/lab/DatePicker"
import { ErrorMessage, useField } from "formik"
import styled from "styled-components"
import { TextField } from "@material-ui/core"

const StyledErrorMessage = styled.p`
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 3px;
  margin-left: 14px;
  margin-right: 14px;
  text-align: left;
  line-height: 1.66;
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
        renderInput={(params) => (
          <TextField {...params} style={{
            marginBottom: error ? "0rem" : "1.5rem",
            width: "70%",
          }}
          />
        )}
      />
      <ErrorMessage component={StyledErrorMessage} name={field.name} />
    </>
  )
}

export default DatePickerField
