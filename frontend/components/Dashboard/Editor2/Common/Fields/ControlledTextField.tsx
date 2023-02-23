import { useCallback, useMemo } from "react"

import { get, omit, set } from "lodash"
import {
  ControllerRenderProps,
  FieldValues,
  PathValue,
  useFormContext,
} from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import HistoryIcon from "@mui/icons-material/History"
import { IconButton, Tooltip as MUITooltip, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
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
export interface ControlledTextFieldProps<T extends FieldValues>
  extends ControlledFieldProps<T> {
  type?: string
  disabled?: boolean
  rows?: number
  width?: string
}

const StyledTextField = styled(TextField)`
  margin-bottom: 1.5rem;
` as typeof TextField

export function ControlledTextField<T extends FieldValues>(
  props: ControlledTextFieldProps<T>,
) {
  const t = useTranslator(CommonTranslations)
  const {
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useFormContext()
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

  const error = useMemo(
    () => Boolean(flattenKeys(errors)[name]),
    [errors, name],
  )

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, e.target.value as PathValue<T, typeof name> & string, {
        shouldDirty: true,
      })
    },
    [name, setValue],
  )

  const initialValue = get(initialValues, name)

  const onRevert = useCallback(
    () => reset(set(getValues(), name, initialValue)),
    [reset, set, getValues, name, initialValue],
  )

  const renderTextField = useCallback(
    ({ onBlur, value }: ControllerRenderProps<T>) => (
      <StyledTextField
        {...(width ? { style: { width } } : {})}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        label={label}
        required={required}
        variant="outlined"
        error={error}
        type={type}
        disabled={disabled}
        rows={rows}
        multiline={(rows && rows > 0) || false}
        InputProps={{
          autoComplete: "none",
          endAdornment: (
            <>
              {revertable ? (
                <Tooltip title={t("editorRevert")}>
                  <span>
                    <IconButton
                      aria-label={t("editorRevert")}
                      disabled={getValues(name) === initialValue}
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
        }}
      />
    ),
    [
      width,
      onChange,
      label,
      required,
      error,
      type,
      disabled,
      rows,
      initialValue,
      revertable,
      tip,
      t,
      getValues,
      name,
      onRevert,
    ],
  )

  return (
    <FieldController
      {...omit(props, ["revertable", "validateOtherFields"])}
      renderComponent={renderTextField}
    />
  )
}
