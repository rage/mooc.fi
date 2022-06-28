import { FieldController } from "./FieldController"
import { ControlledFieldProps } from "/components/Dashboard/Editor2/Common/Fields"
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"

export interface ControlledImageInputProps extends ControlledFieldProps {
  onImageLoad: (_: string | ArrayBuffer | null) => void
  onImageAccepted: (_: File) => void
  onClose: Function | null
  thumbnail: string
}

export function ControlledImageInput(props: ControlledImageInputProps) {
  const { name, label, onImageLoad, onImageAccepted, onClose, thumbnail } =
    props

  return (
    <FieldController
      name={name}
      type="file"
      label={label}
      renderComponent={() => (
        <ImageDropzoneInput
          onImageLoad={onImageLoad}
          onImageAccepted={onImageAccepted}
        >
          <ImagePreview file={thumbnail} onClose={onClose} />
        </ImageDropzoneInput>
      )}
    />
  )
}
