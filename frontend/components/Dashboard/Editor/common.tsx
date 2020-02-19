import { FormControl, FormGroup, InputLabel } from "@material-ui/core"
import { Field } from "formik"
import { TextField } from "formik-material-ui"
import styled from "styled-components"
import { useContext } from "react"
import AnchorContext from "/contexes/AnchorContext"

export const StyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
  background-color: white;
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

export const StyledField = styled(Field)`
  .input-label {
    background-color: white;
    font-size: 23px;
    padding-right: 7px;
    transform: translate(14px, -9px) scale(0.75);
  }
  .input-required {
    color: #df7a46;
  }
`

export const AdjustingAnchorLink = styled.a<{ id: string }>`
  display: block;
  position: relative;
  top: -120px;
  visibliity: hidden;
`

export const EnumeratingAnchor: React.FC<any> = ({ id }: { id: string }) => {
  const { addAnchor } = useContext(AnchorContext)
  addAnchor(id)

  return <AdjustingAnchorLink id={id} />
}

export const StyledFieldWithAnchor: React.FC<any> = ({
  name,
  ...props
}: {
  name: string
}) => {
  return (
    <>
      <EnumeratingAnchor id={name} />
      <StyledField name={name} {...props} />
    </>
  )
}
