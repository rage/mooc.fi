import React from "react"

import {
  FastField,
  FastFieldProps,
  Field,
  FieldAttributes,
  useFormikContext,
} from "formik"
import { TextField } from "formik-mui"

import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormGroup,
  InputLabel,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useAnchorContext } from "/contexts/AnchorContext"

const BaseStyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
  background-color: white;
` as typeof TextField

export const StyledTextField = React.memo(BaseStyledTextField)

export const OutlinedInputLabel = styled(InputLabel)`
  background-color: #ffffff;
  padding: 0 4px 0 4px;
` as typeof InputLabel

export const OutlinedFormControl = styled(FormControl)`
  margin-bottom: 1rem;
` as typeof FormControl

export const OutlinedFormGroup = styled(FormGroup, {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>`
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
    border-color: "#3f51b5";
  }

  @media (hover: none) {
    border: 1px solid rgba(0, 0, 0, 0.23);
  }
`

const BaseStyledField = styled(FastField)`
  .input-label {
    background-color: white;
    font-size: 23px;
    padding-right: 7px;
    transform: translate(14px, -9px) scale(0.75);
  }
  .input-required {
    color: #df7a46;
  }
` as typeof FastField

export const StyledField = React.memo(BaseStyledField)

export const FormSubtitle = styled(Typography)`
  padding: 20px 0px 20px 0px;
  margin-bottom: 1rem;
  font-size: 2em;
` as typeof Typography

export const AdjustingAnchorLink = styled("div")<{ id: string }>`
  display: block;
  position: relative;
  top: -120px;
  visibility: hidden;
`

interface CheckboxFieldProps {
  id: string
  label: string
  checked: boolean
}

const BaseCheckboxField = ({ id, label, checked }: CheckboxFieldProps) => {
  const { setFieldValue } = useFormikContext()

  return (
    <Field
      id={id}
      label={label}
      type="checkbox"
      name={id}
      checked={checked}
      component={(props: CheckboxWithLabelProps) => (
        <CheckboxWithLabel
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue(id, e.target.checked)
          }
          {...props}
        />
      )}
      Label={{ label: label }}
    />
  )
}
export const CheckboxField = React.memo(BaseCheckboxField)

interface CheckboxWithLabelProps extends CheckboxProps {
  Label: Omit<FormControlLabelProps, "checked" | "name" | "value" | "control">
}

const BaseCheckboxWithLabel = ({ Label, ...props }: CheckboxWithLabelProps) => {
  return <FormControlLabel control={<Checkbox {...props} />} {...Label} />
}

export const CheckboxWithLabel = React.memo(BaseCheckboxWithLabel)

interface EnumeratingAnchorProps {
  id: string
  tab?: number
}

export const EnumeratingAnchor: React.FC<EnumeratingAnchorProps> = ({
  id,
  tab = 0,
}) => {
  const { addAnchor } = useAnchorContext()
  addAnchor(id, tab)

  return <AdjustingAnchorLink id={id} />
}

interface StyledFieldWithAnchorProps extends FastFieldProps {
  id?: string
  name: string
  tab?: number
  error?: any
}

export const StyledFieldWithAnchor = React.forwardRef<
  typeof StyledField,
  StyledFieldWithAnchorProps & FieldAttributes<any>
>((props, ref) => {
  const { id, name, tab = 0, error, ...rest } = props
  const { addAnchor } = useAnchorContext()
  addAnchor(id ?? name, tab)

  return (
    <>
      <AdjustingAnchorLink id={id ?? name} />
      <StyledField name={name} ref={ref} error={Boolean(error)} {...rest} />
    </>
  )
})

interface TabSectionProps {
  currentTab: number
  tab: number
}

export const TabSection: React.FC<React.PropsWithChildren<TabSectionProps>> = ({
  currentTab,
  tab,
  children,
  ...props
}) => (
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
