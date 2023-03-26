import { styled } from "@mui/material/styles"

const StyledInput = styled("input")`
  display: hidden;
  opacity: 0;
  position: absolute;
  left: -100000px;
`

function DisableAutoComplete() {
  return (
    <StyledInput
      id="disableAutocomplete"
      key="disableAutocomplete"
      name="disableAutocomplete"
      autoComplete="on"
      readOnly
    />
  )
}

export default DisableAutoComplete
