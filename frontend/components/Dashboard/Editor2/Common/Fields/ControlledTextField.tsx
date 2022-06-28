import { useEffect, useState } from "react"

import { omit } from "lodash"
import { get, set } from "lodash"
import {
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
  useFormContext,
} from "react-hook-form"

import HelpIcon from "@mui/icons-material/Help"
import HistoryIcon from "@mui/icons-material/History"
import { IconButton, TextField, Tooltip } from "@mui/material"

import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
import CommonTranslations from "/translations/common"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"

export interface ControlledTextFieldProps extends ControlledFieldProps {
  type?: string
  disabled?: boolean
  rows?: number
}

export function ControlledTextField<T>(props: ControlledTextFieldProps) {
  const t = useTranslator(CommonTranslations)
  const {
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useFormContext()
  const { initialValues } = useEditorContext()
  const { label, required, name, tip, type, disabled, revertable, rows } = props

  const [error, setError] = useState(Boolean(flattenKeys(errors)[name]))
  useEffect(() => {
    setError(Boolean(flattenKeys(errors)[name]))
  }, [errors])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      name,
      e.target.value as UnpackNestedValue<PathValue<FieldValues, Path<T>>>,
      { shouldDirty: true },
    )
  }

  const initialValue = get(initialValues, name)

  return (
    <FieldController
      {...omit(props, ["revertable", "validateOtherFields"])}
      style={{ marginBottom: "1.5rem" }}
      renderComponent={({ onBlur, value }) => (
        <>
          <TextField
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
                          onClick={() =>
                            reset(set(getValues(), name, initialValue))
                          }
                          size="large"
                        >
                          <HistoryIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : null}
                  {tip ? (
                    <Tooltip title={tip}>
                      <HelpIcon />
                    </Tooltip>
                  ) : null}
                </>
              ),
            }}
          />
        </>
      )}
    />
  )
}
