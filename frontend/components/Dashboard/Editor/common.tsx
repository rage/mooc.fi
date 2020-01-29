import { FormControl, FormGroup, InputLabel } from "@material-ui/core"
import { TextField } from "formik-material-ui"
import styled from "styled-components"

export const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
  background-color: white;
  font
`

export const OutlinedInputLabel = styled(InputLabel)`
  background-color: #ffffff;
  padding: 0 4px 0 4px;
`

export const OutlinedFormControl = styled(FormControl)`
  margin-bottom: 1rem;
`

export const OutlinedFormGroup = styled(FormGroup)<{ error?: boolean }>`
  border-radius: 4px;
  border: 1px solid
    ${props => (props.error ? "#F44336" : "rgba(0, 0, 0, 0.23)")};
  padding: 18.5px 14px;
  transition: padding-left 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
    border-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.87);
  }

  &:focus {
    bordercolor: "#3f51b5";
  }

  @media (hover: none) {
    border: 1px solid rgba(0, 0, 0, 0.23);
  }
`
