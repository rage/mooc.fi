import { omit } from "lodash"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  ControlledFieldProps,
  FieldController,
} from "/components/Dashboard/Editor2/Common/Fields"
import { useEditorContext } from "/components/Dashboard/Editor2/EditorContext"
import CommonTranslations from "/translations/common"
import flattenKeys from "/util/flattenKeys"
import { useTranslator } from "/util/useTranslator"
import { TextField, Tooltip, IconButton } from "@material-ui/core"
import HistoryIcon from "@material-ui/icons/History"
import HelpIcon from "@material-ui/icons/Help"

export interface ControlledTextFieldProps extends ControlledFieldProps {
  type?: string
  disabled?: boolean
  rows?: number
}

export function ControlledTextField(props: ControlledTextFieldProps) {
  const t = useTranslator(CommonTranslations)
  const { errors, reset, setValue, getValues } = useFormContext()
  const { initialValues } = useEditorContext()
  const { label, required, name, tip, type, disabled, revertable, rows } = props

  const [error, setError] = useState(Boolean(flattenKeys(errors)[name]))
  useEffect(() => {
    setError(Boolean(flattenKeys(errors)[name]))
  }, [errors])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, e.target.value, { shouldDirty: true })
  }

  return (
    <FieldController
      {...omit(props, ["revertable", "validateOtherFields"])}
      style={{ marginTop: "1.5rem" }}
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
                      <IconButton
                        aria-label={t("editorRevert")}
                        onClick={() =>
                          reset({
                            ...getValues(),
                            [name]: (initialValues as any)[name],
                          })
                        }
                      >
                        <HistoryIcon />
                      </IconButton>
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
