import { useController } from "react-hook-form"

import { ControlledFieldProps } from "."
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"

export interface ControlledImageInputProps extends ControlledFieldProps {
  onImageLoad: (_: string | ArrayBuffer | null) => void
  onImageAccepted: (_: File) => void
  onImageRemove:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | null
  thumbnail: string
}

export function ControlledImageInput(props: ControlledImageInputProps) {
  const { name, onImageLoad, onImageAccepted, onImageRemove, thumbnail } = props
  const { field } = useController({
    name,
  })

  return (
    <ImageDropzoneInput
      inputRef={field.ref}
      onImageLoad={onImageLoad}
      onImageAccepted={onImageAccepted}
    >
      <ImagePreview file={thumbnail} onImageRemove={onImageRemove} />
    </ImageDropzoneInput>
  )
}
