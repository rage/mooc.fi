import {
  FormControl,
  FormGroup,
  InputLabel,
  Typography,
} from "@material-ui/core"
import { Field } from "formik"
import { TextField } from "formik-material-ui"
import styled from "styled-components"
import { PropsWithChildren, useContext } from "react"
import AnchorContext from "/contexes/AnchorContext"
import { CheckboxWithLabel } from "formik-material-ui"

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
    ${(props) => (props.error ? "#F44336" : "rgba(0, 0, 0, 0.23)")};
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

export const FormSubtitle = styled(Typography)<any>`
  padding: 20px 0px 20px 0px;
  margin-bottom: 1rem;
  font-size: 2em;
`

export const AdjustingAnchorLink = styled.a<{ id: string }>`
  display: block;
  position: relative;
  top: -120px;
  visibliity: hidden;
`

export const CheckboxField = ({
  id,
  label,
  checked,
}: {
  id: string
  label: string
  checked: boolean
}) => (
  <Field
    id={id}
    label={label}
    type="checkbox"
    name={id}
    checked={checked}
    component={CheckboxWithLabel}
    Label={{ label: label }}
  />
)

interface EnumeratingAnchorProps {
  id: string
  tab: number
}

export const EnumeratingAnchor: React.FC<any> = ({
  id,
  tab,
}: EnumeratingAnchorProps) => {
  const { addAnchor } = useContext(AnchorContext)
  addAnchor(id, tab)

  return <AdjustingAnchorLink id={id} />
}

export const StyledFieldWithAnchor: React.FC<any> = ({
  name,
  tab = 0,
  error,
  ...props
}: {
  name: string
  tab: number
  error?: any
}) => {
  return (
    <>
      <EnumeratingAnchor id={name} tab={tab} />
      <StyledField name={name} {...props} error={Boolean(error)} />
    </>
  )
}

interface TabSectionProps {
  currentTab: number
  tab: number
}

export const TabSection = ({
  currentTab,
  tab,
  children,
  ...props
}: PropsWithChildren<TabSectionProps>) => (
  <section
    style={{
      display: currentTab === tab ? "initial" : "none",
    }}
    {...props}
  >
    {children}
  </section>
)

export const inputLabelProps = {
  fontSize: 16,
  shrink: true,
  classes: { root: "input-label", required: "input-required" },
}
