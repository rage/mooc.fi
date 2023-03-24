import React, { useCallback, useMemo } from "react"

import { get, omit, set } from "lodash"
import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
  useFormContext,
} from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import HistoryIcon from "@mui/icons-material/History"
import { IconButton, Tooltip as MUITooltip, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ControlledFieldProps,
  FieldController,
} from "."
import { useEditorContext } from "../../EditorContext"
import CommonTranslations from "/translations/common"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"

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
export interface ControlledTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControlledFieldProps<TFieldValues, TName> {
  type?: string
  disabled?: boolean
  rows?: number
  width?: string
}

const StyledTextField = styled(TextField, { shouldForwardProp: (prop) => prop !== "width"})<{ width?: string }>`
  margin-bottom: 1.5rem;
  ${({ width }) => width && `width: ${width};`}
`

const convertName = (name: string) => name.replace(/\.(\d+)\./, "[$1].")

function ControlledTextFieldComponent<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledTextFieldProps<TFieldValues, TName>) {
  const t = useTranslator(CommonTranslations)
  const {
    formState, //: { errors },
    resetField,
  } = useFormContext<TFieldValues>()
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
  } = props
  const initialValue = get(initialValues, name)

  const { field } = useController<TFieldValues>({
    name,
    rules: { required },
  })
  // TODO: hack to convert from formik compatible errors to this; when we get rid of formik,
  // we can change this
  const error = useMemo(
    () => Boolean(flattenKeys(formState.errors)[convertName(name)]),
    [formState.errors, name],
  )

  /*const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, e.target.value as PathValue<T, typeof name> & string, {
        shouldDirty: true,
      })
    },
    [name, setValue],
  )*/

  const onRevert = useCallback(
    () => resetField(name),
    [resetField, name],
  )

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

  /*return (
    <FieldController
      {...omit(props, ["revertable", "validateOtherFields"])}
      formState={formState}
      renderComponent={renderTextField}
    />
  )*/
  return (
    <StyledTextField
      width={width}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      inputRef={field.ref}
      label={label}
      required={required}
      variant="outlined"
      error={error}
      type={type}
      disabled={disabled}
      rows={rows}
      multiline={(rows && rows > 0) || false}
      InputProps={InputProps}
    />
  )
}

export const ControlledTextField = React.memo(
  ControlledTextFieldComponent,
) as typeof ControlledTextFieldComponent
