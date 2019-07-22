import React, { useState } from "react"
import { FieldProps } from "formik"
import { useDropzone } from "react-dropzone"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropzoneContainer: {
      width: "100%",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 2,
      borderStyle: "dashed",
      padding: "20px",
      /*       (props: { [key: string]: any }) => 
        props.isDragActive
          ? "dashed"
          : "solid", */
      borderColor: (props: { [key: string]: any }) =>
        props.isDragActive
          ? props.isDragReject
            ? "#FF0000"
            : "#00A000"
          : "#A0A0A0",
      transition: "border .24s ease-in-out",
    },
  }),
)

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
    isDragAccept,
    isDragReject,
    // acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    preventDropOnDocument: true,
  })

  const classes = useStyles({ isDragActive, isDragAccept, isDragReject })

  return (
    <div className={classes.dropzoneContainer} {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
      {isDragActive ? (
        isDragReject ? (
          <p>Not an acceptable format!</p>
        ) : (
          <p>Drop an image file here</p>
        )
      ) : (
        <p>Drop image or click to select</p>
      )}
      {error ? <p>{error}</p> : null}
    </div>
  )
}

export default ImageDropzoneInput
