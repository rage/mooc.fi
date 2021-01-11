import { useFormContext } from "react-hook-form"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { addDomain } from "/util/imageUtils"
import {
  ControlledFieldProps,
  ControlledHiddenField,
} from "/components/Dashboard/Editor2/Common/Fields"
import { CourseDetails_course_photo } from "/static/types/generated/CourseDetails"
import { FieldController } from "./FieldController"

export interface ControlledImageInputProps extends ControlledFieldProps {
  defaultValue?: CourseDetails_course_photo | string | null
}

export function ControlledImageInput(props: ControlledImageInputProps) {
  const { watch, setValue } = useFormContext()
  const { name, label, defaultValue } = props

  const onImageLoad = (value: string | ArrayBuffer | null) =>
    setValue("thumbnail", value)
  const onImageAccepted = (value: File) =>
    setValue(name, value, { shouldDirty: true })

  const onClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    setValue("thumbnail", "")
    setValue(name, null, { shouldDirty: true })

    if (defaultValue) {
      // TODO: not dirtying the form
      setValue("delete_photo", true)
    }
  }

  return (
    <>
      <ControlledHiddenField
        name="thumbnail"
        defaultValue={watch("thumbnail") ?? ""}
      />
      <ControlledHiddenField name="photo" defaultValue={watch("photo") ?? ""} />
      <ControlledHiddenField
        name="delete_photo"
        defaultValue={watch("delete_photo") ?? false}
      />
      <FieldController
        name={name}
        type="file"
        label={label}
        renderComponent={() => (
          <ImageDropzoneInput
            onImageLoad={onImageLoad}
            onImageAccepted={onImageAccepted}
          >
            <ImagePreview
              file={addDomain(watch("thumbnail"))}
              onClose={onClose}
            />
          </ImageDropzoneInput>
        )}
      />
    </>
  )
}
