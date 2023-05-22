import React from "react"

import { useController } from "react-hook-form"

import { ControlledFieldProps } from "."
import ImageDropzoneInput from "/components/Dashboard/ImageDropzoneInput"
import ImagePreview from "/components/Dashboard/ImagePreview"
import { useAnchor } from "/hooks/useAnchors"

export interface ControlledImageInputProps extends ControlledFieldProps {
  onImageLoad: (_: string | ArrayBuffer | null) => void
  onImageAccepted: (_: File) => void
  onImageRemove:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | null
  thumbnail: string
}

function ControlledImageInputImpl(props: ControlledImageInputProps) {
  const { name, onImageLoad, onImageAccepted, onImageRemove, thumbnail } = props
  const anchor = useAnchor(name)
  const { field } = useController({
    name,
  })

  return (
    <ImageDropzoneInput
      inputRef={(el) => {
        field.ref(el)
        anchor.ref(el)
      }}
      onImageLoad={onImageLoad}
      onImageAccepted={onImageAccepted}
      thumbnail={thumbnail}
    >
      <ImagePreview file={thumbnail} onImageRemove={onImageRemove} />
    </ImageDropzoneInput>
  )
}

export const ControlledImageInput = React.memo(
  ControlledImageInputImpl,
) as typeof ControlledImageInputImpl
