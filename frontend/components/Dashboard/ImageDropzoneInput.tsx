import { useState, useEffect } from "react"
import { useField, FieldInputProps } from "formik"
import { useDropzone, FileRejection } from "react-dropzone"
import { Typography } from "@material-ui/core"
import styled from "styled-components"
import CommonTranslations from "/translations/common"
import { FormValues } from "/components/Dashboard/Editor/types"
import { useTranslator } from "/translations"

// Chrome only gives dragged file mimetype on drop, so all filetypes would appear rejected on drag
const isChrome = process.browser
  ? !!(window as any).chrome &&
    (!!(window as any).chrome.webstore || !!(window as any).chrome.runtime)
  : false

const DropzoneContainer = styled.div<any>`
  display: flex;
  width: 100%;
  min-height: 250px;
  align-items: center;
  border-width: 2px;
  border-radius: 4px;
  border-style: ${({ isDragActive }) => (isDragActive ? "solid" : "dashed")};
  padding: 20px;
  background-color: ${({ isDragActive, isDragAccept, error }) =>
    isDragActive
      ? isDragAccept
        ? "#E0FFE0"
        : "#FFC0C0"
      : error
      ? "#FFC0C0"
      : "#FFFFFF"};
  border-color: ${({ isDragActive, isDragAccept }) =>
    isDragActive ? (isDragAccept ? "#00A000" : "#FF0000") : "rgba(0,0,0,0.23)"};
  transition: border 0.24s ease-in-out;
  &:hover {
    cursor: pointer;
    border-color: #00a000;
  }
`

interface MessageProps {
  message: string
  error?: boolean
}

interface DropzoneProps extends FieldInputProps<FormValues> {
  onImageLoad: (result: string | ArrayBuffer | null) => void
  children: any
}

const ImageDropzoneInput = ({
  onImageLoad,
  children,
  ...props
}: DropzoneProps) => {
  const [, , { setValue }] = useField(props.name)
  const t = useTranslator(CommonTranslations)
  const [status, setStatus] = useState<MessageProps>({
    message: t("imageDropMessage"),
  })

  const onDrop = (accepted: File[], rejected: FileRejection[]) => {
    const reader = new FileReader()

    reader.onload = () => onImageLoad(reader.result)

    if (accepted.length) {
      setValue(accepted[0])
      reader.readAsDataURL(accepted[0])
    }

    if (rejected.length) {
      setStatus({ message: t("imageNotAnImage"), error: true })
      setTimeout(() => setStatus({ message: t("imageDropMessage") }), 2000)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    draggedFiles,
  } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    preventDropOnDocument: true,
  })

  useEffect(() => {
    if (isDragActive && isDragReject && draggedFiles.length && !isChrome) {
      setStatus({ message: t("imageNotAcceptableFormat"), error: true })
    } else if (isDragActive) {
      setStatus({ message: t("imageDropHere") })
    } else {
      setStatus({ message: t("imageDropMessage") })
    }
  }, [isDragActive, isDragReject, draggedFiles])

  return (
    <DropzoneContainer
      isDragActive={isDragActive}
      isDragAccept={isChrome || isDragAccept}
      error={status.error}
      {...getRootProps()}
    >
      {children}
      <input {...getInputProps()} />
      <Typography
        variant="body1"
        align="center"
        style={{ color: status.error ? "#FF0000" : "#000000" }}
      >
        {status.message}
      </Typography>
    </DropzoneContainer>
  )
}

export default ImageDropzoneInput
