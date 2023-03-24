import { useCallback } from "react"

import { FieldController } from "./FieldController"
import { ControlledFieldProps } from "."
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { useController } from "react-hook-form"

export interface ControlledImageInputProps extends ControlledFieldProps {
  onImageLoad: (_: string | ArrayBuffer | null) => void
  onImageAccepted: (_: File) => void
  onImageRemove:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | null
  thumbnail: string
}

export function ControlledImageInput(props: ControlledImageInputProps) {
  const { name, label, onImageLoad, onImageAccepted, onImageRemove, thumbnail } =
    props
  const { field } = useController({
    name
  })
  const renderImageDropzoneInput = useCallback(
    () => (
      <ImageDropzoneInput
        onImageLoad={onImageLoad}
        onImageAccepted={onImageAccepted}
      >
        <ImagePreview file={thumbnail} onImageRemove={onImageRemove} />
      </ImageDropzoneInput>
    ),
    [onImageLoad, onImageAccepted, thumbnail, onImageRemove],
  )
    
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
