import React, { useCallback, useMemo } from "react"

import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form"
import { prop } from "remeda"

import { InputAdornment, TextField, TextFieldProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { pulseAnimation } from ".."
import { useCourseEditorData } from "../../Course/CourseEditorDataContext"
import RevertButton from "/components/RevertButton"
import { InfoTooltip } from "/components/Tooltip"
import { useAnchor } from "/hooks/useAnchors"

const TextFieldContainer = styled("div")`
  display: flex;
  flex-direction: column;

  ${pulseAnimation}
`

export interface ControlledTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  ContainerType = HTMLDivElement,
  ContainerPropType = React.HTMLAttributes<ContainerType>,
> extends ControlledFieldProps<TFieldValues, TName> {
  type?: string
  disabled?: boolean
  rows?: number
  width?: string
  unit?: string
  Container?: (props: ContainerPropType) => React.JSX.Element
  containerProps?: ContainerPropType
}

const StyledTextField = styled(TextField)<{ width?: string }>`
  margin-bottom: 1.5rem;
`

function ControlledTextFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControlledTextFieldProps<TFieldValues, TName> &
    Omit<TextFieldProps, "name">,
) {
  const { resetField } = useFormContext<TFieldValues>()
  const { defaultValues } = useCourseEditorData()
  const {
    label,
    required,
    name,
    tip,
    type,
    disabled,
    revertable,
    rows,
    width,
    unit,
    Container = TextFieldContainer,
    containerProps,
    ...textFieldProps
  } = props
  const anchor = useAnchor(name)
  const defaultValue = prop<typeof defaultValues, keyof typeof defaultValues>(
    name,
  )(defaultValues)

  const { field, fieldState } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const onRevert = useCallback(() => resetField(name), [resetField, name])

  const InputProps = useMemo(
    () => ({
      autoComplete: "none",
      endAdornment:
        revertable || tip || unit ? (
          <InputAdornment position="end">
            {unit && <span>{unit}</span>}
            {revertable && (
              <RevertButton
                disabled={field.value === defaultValue}
                onRevert={onRevert}
              />
            )}
            {tip && <InfoTooltip label={label} title={tip} />}
          </InputAdornment>
        ) : null,
    }),
    [revertable, field, tip, unit, defaultValue, onRevert],
  )

  return (
    <Container {...containerProps}>
      <StyledTextField
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={field.value}
        name={field.name}
        label={label}
        required={required}
        variant="outlined"
        error={fieldState.invalid}
        type={type}
        disabled={disabled}
        rows={rows}
        multiline={(rows && rows > 0) || false}
        InputProps={InputProps}
        {...textFieldProps}
        inputRef={(el) => {
          field.ref(el)
          anchor.ref(el)
        }}
        helperText={fieldState.error?.message}
      />
    </Container>
  )
}

export const ControlledTextField = ControlledTextFieldComponent
