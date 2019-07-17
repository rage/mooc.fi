import React, { useState } from "react"
import { FieldProps } from "formik"
import { useDropzone } from "react-dropzone"

const ImageDropzoneInput = ({
  field,
  form,
  onImageLoad,
  children,
}: FieldProps & {
  onImageLoad: (result: string | ArrayBuffer | null) => void
  children: any
}) => {
  const { touched, errors, setFieldValue } = form
  const [error, setError] = useState<string | null>(null)

  const onDrop = (accepted: File[], rejected: File[]) => {
    const reader = new FileReader()

    reader.onload = () => onImageLoad(reader.result)

    if (accepted.length) {
      setFieldValue(field.name, accepted[0])
      reader.readAsDataURL(accepted[0])
    }

    if (rejected.length) {
      setError("not an image!")
    } else {
      setError("")
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    preventDropOnDocument: true,
  })

  return (
    <div {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop an image file here</p>
      ) : (
        <p>Drop image or click to select</p>
      )}
      {error ? <p>{error}</p> : null}
    </div>
  )
}

export default ImageDropzoneInput
