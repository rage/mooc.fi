import React, { useState, useEffect } from "react"
import { FieldProps } from "formik"
import { useDropzone } from "react-dropzone"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

/* TODO/FIXME: isDragReject (coming from react-dropzone) seems to equal true 
  in some cases even if the dragged file is accepted. This means that sometimes 
  the error is shown and the box styling changes to error state 
  with correct input!
*/

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropzoneContainer: {
      width: "100%",
      alignItems: "center",
      borderWidth: 2,
      borderRadius: 2,
      borderStyle: "dashed",
      padding: "20px",
      backgroundColor: (props: { [key: string]: any }) =>
        props.isDragActive
          ? props.isDragAccept
            ? "#E0FFE0"
            : "#FFC0C0"
          : "#FFFFFF",
      borderColor: (props: { [key: string]: any }) =>
        props.isDragActive
          ? props.isDragAccept
            ? "#00A000"
            : "#FF0000"
          : "#A0A0A0",
      transition: "border .24s ease-in-out",
    },
  }),
)

interface MessageProps {
  message: string
  error?: boolean
}

interface DropzoneProps extends FieldProps {
  onImageLoad: (result: string | ArrayBuffer | null) => void
  children: any
}

const defaultMessage = {
  message: "Drop image or click to select",
}

const ImageDropzoneInput = ({
  field,
  form,
  onImageLoad,
  children,
}: DropzoneProps) => {
  const { touched, errors, setFieldValue } = form
  const [status, setStatus] = useState<MessageProps>(defaultMessage)

  const onDrop = (accepted: File[], rejected: File[]) => {
    const reader = new FileReader()

    reader.onload = () => onImageLoad(reader.result)

    if (accepted.length) {
      setFieldValue(field.name, accepted[0])
      reader.readAsDataURL(accepted[0])
    }

    if (rejected.length) {
      setStatus({ message: "That was not an image!", error: true })
      setTimeout(() => setStatus(defaultMessage), 2000)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    draggedFiles,
    // acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    preventDropOnDocument: true,
  })

  useEffect(() => {
    if (isDragActive && isDragReject && draggedFiles.length) {
      setStatus({ message: "Not an acceptable format!", error: true })
    } else if (isDragActive) {
      setStatus({ message: "Drop image file here" })
    } else {
      setStatus(defaultMessage)
    }
  }, [isDragActive, isDragReject, draggedFiles])

  const classes = useStyles({
    isDragActive,
    isDragAccept,
    isDragReject,
  })

  return (
    <div className={classes.dropzoneContainer} {...getRootProps()}>
      {children}
      <input {...getInputProps()} />
      <p style={{ color: status.error ? "#FF0000" : "#000000" }}>
        {status.message}
      </p>
    </div>
  )
}

export default ImageDropzoneInput
