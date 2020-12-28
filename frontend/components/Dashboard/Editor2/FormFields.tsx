import { useCallback } from "react"
import {
  Controller,
  useFormContext,
  ControllerRenderProps,
} from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { EnumeratingAnchor } from "/components/Dashboard/Editor/common"
import { FormHelperText, TextField, Tooltip } from "@material-ui/core"
import DatePicker from "@material-ui/lab/DatePicker"
import HelpIcon from "@material-ui/icons/Help"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { addDomain } from "/util/imageUtils"
import { CourseDetails_course_photo } from "/static/types/generated/CourseDetails"

interface FieldProps {
  name: string
  label: string
  required?: boolean
  tab?: number
}
interface FieldControllerProps extends FieldProps {
  renderComponent: (props: ControllerRenderProps) => JSX.Element
}

export const FieldController = ({
  name,
  label,
  required = false,
  tab = 0,
  renderComponent,
}: FieldControllerProps) => {
  const { control, errors, setValue } = useFormContext()

  const onChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(name, target.value, { shouldValidate: true }),
    [name],
  )

  return (
    <Controller
      name={name}
      control={control}
      autoComplete="disabled"
      render={(renderProps) => (
        <div style={{ marginBottom: "1.5rem" }}>
          <EnumeratingAnchor id={name} tab={tab} />
          {renderComponent({ ...renderProps, onChange })}
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <FormHelperText style={{ color: "#f44336" }}>
                {message}
              </FormHelperText>
            )}
          />
        </div>
      )}
    />
  )
}

interface ControlledFieldProps extends FieldProps {
  tip?: string
  validateOtherFields?: Array<string>
}

export const ControlledTextField = (props: ControlledFieldProps) => {
  const { errors, setValue } = useFormContext()
  const { label, required, name, tip } = props

  return (
    <FieldController
      {...props}
      renderComponent={({ onBlur, value, ref }) => (
        <TextField
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(name, e.target.value, { shouldDirty: true })
          }}
          onBlur={onBlur}
          value={value}
          label={label}
          required={required}
          variant="outlined"
          error={Boolean(errors[name as keyof typeof errors])}
          InputProps={{
            autoComplete: "none",
            endAdornment: tip ? (
              <Tooltip title={tip}>
                <HelpIcon />
              </Tooltip>
            ) : null,
          }}
        />
      )}
    />
  )
}

export const ControlledDatePicker = (props: ControlledFieldProps) => {
  const { watch, setValue, trigger } = useFormContext()
  const { name, label, validateOtherFields = [] } = props

  return (
    <FieldController
      {...props}
      renderComponent={() => (
        <DatePicker
          value={watch(name)}
          onChange={(date: any) => {
            setValue(name, date, { shouldValidate: true, shouldDirty: true })
            return { value: date }
          }}
          onClose={() => trigger([name, ...validateOtherFields])}
          label={label}
          allowKeyboardControl={true}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
          /*          InputProps={{
          endAdornment:
            <IconButton style={{ padding: 0 }}>
              <CalendarIcon />
            </IconButton>
        }}*/
        />
      )}
    />
  )
}

interface ControlledImageInputProps extends ControlledFieldProps {
  defaultValue: CourseDetails_course_photo | null
}

export const ControlledImageInput = (props: ControlledImageInputProps) => {
  const { watch, setValue, control } = useFormContext()
  const { name, label, defaultValue } = props

  return (
    <FieldController
      {...props}
      renderComponent={() => (
        <>
          <Controller
            name="thumbnail"
            control={control}
            as={<input type="hidden" />}
          />
          <Controller
            name={name}
            type="file"
            label={label}
            as={(props) => (
              <ImageDropzoneInput
                {...props}
                onImageLoad={(value) => setValue("thumbnail", value)}
                onImageAccepted={(value) =>
                  setValue(name, value, { shouldDirty: true })
                }
              >
                <ImagePreview
                  file={addDomain(watch("thumbnail"))}
                  onClose={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                  ): void => {
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                    setValue("thumbnail", "")
                    setValue(name, null)

                    if (defaultValue) {
                      // TODO: not dirtying the form
                      setValue("delete_photo", true, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  }}
                />
              </ImageDropzoneInput>
            )}
          />
        </>
      )}
    />
  )
}
