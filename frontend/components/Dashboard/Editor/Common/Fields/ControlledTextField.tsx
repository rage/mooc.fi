import React, { useCallback, useMemo } from "react"

import { get } from "lodash"
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import HistoryIcon from "@mui/icons-material/History"
import {
  IconButton,
  Tooltip as MUITooltip,
  TextField,
  TextFieldProps,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { ControlledFieldProps } from "."
import { useErrorMessage } from ".."
import { useEditorContext } from "../../EditorContext"
import { useAnchor } from "/components/Dashboard/Editor/EditorContext"
import { useTranslator } from "/hooks/useTranslator"
import useWhyDidYouUpdate from "/lib/why-did-you-update"
import CommonTranslations from "/translations/common"

const Tooltip = styled(MUITooltip)`
  :hover {
    cursor: pointer;
  }
`

const QuestionTooltip = styled(MUITooltip)`
  :hover {
    cursor: help;
  }
`
const TextFieldContainer = styled("div")`
  display: flex;
  flex-direction: column;
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
  Container?: (props: ContainerPropType) => JSX.Element
  containerProps?: ContainerPropType
}

const StyledTextField = styled(TextField)<{ width?: string }>`
  margin-bottom: 1.5rem;
`

function ControlledTextFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledTextFieldProps<TFieldValues, TName> & TextFieldProps) {
  const t = useTranslator(CommonTranslations)
  const { resetField } = useFormContext<TFieldValues>()
  const { initialValues } = useEditorContext()
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
    Container = TextFieldContainer,
    containerProps,
    ...textFieldProps
  } = props
  useWhyDidYouUpdate(`ControlledTextField ${name}`, props)
  const anchor = useAnchor(name)
  const initialValue = get(initialValues, name)

  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })

  const onRevert = useCallback(() => resetField(name), [resetField, name])

  const InputProps = useMemo(
    () => ({
      autoComplete: "none",
      endAdornment: (
        <>
          {revertable ? (
            <Tooltip title={t("editorRevert")}>
              <span>
                <IconButton
                  aria-label={t("editorRevert")}
                  disabled={field.value === initialValue}
                  onClick={onRevert}
                  size="large"
                >
                  <HistoryIcon />
                </IconButton>
              </span>
            </Tooltip>
          ) : null}
          {tip ? (
            <QuestionTooltip title={tip}>
              <HelpIcon />
            </QuestionTooltip>
          ) : null}
        </>
      ),
    }),
    [revertable, field, tip, initialValue, onRevert],
  )

  const { error, hasError } = useErrorMessage(name)

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
        error={hasError}
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
        helperText={error}
      />
    </Container>
  )
}

export const ControlledTextField = ControlledTextFieldComponent
