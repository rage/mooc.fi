import { PropsWithChildren, useEffect, useState } from "react"

import { DropzoneState, FileRejection, useDropzone } from "react-dropzone"

import styled from "@emotion/styled"
import { Typography } from "@mui/material"

import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

// Chrome only gives dragged file mimetype on drop, so all filetypes would appear rejected on drag
const isChrome = process.browser
  ? !!(window as any).chrome &&
    (!!(window as any).chrome.webstore || !!(window as any).chrome.runtime)
  : false

const DropzoneContainer = styled.div<
  DropzoneState & { error: MessageProps["error"] }
>`
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
  justify-content: center;
`

interface MessageProps {
  message: string
  error?: boolean
}

interface DropzoneProps {
  onImageLoad: (result: string | ArrayBuffer | null) => void
  onImageAccepted: (field: File) => void
}

const ImageDropzoneInput = ({
  onImageLoad,
  children,
  onImageAccepted,
}: PropsWithChildren<DropzoneProps>) => {
  const t = useTranslator(CommonTranslations)
  const [status, setStatus] = useState<MessageProps>({
    message: t("imageDropMessage"),
  })

  const onDrop = (accepted: File[], rejected: FileRejection[]) => {
    const reader = new FileReader()

    reader.onload = () => onImageLoad(reader.result)

    if (accepted.length) {
      onImageAccepted(accepted[0])
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
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".svg"],
    },
    multiple: false,
    preventDropOnDocument: true,
  })

  useEffect(() => {
    if (isDragActive && isDragReject && !isChrome) {
      setStatus({ message: t("imageNotAcceptableFormat"), error: true })
    } else if (isDragActive) {
      setStatus({ message: t("imageDropHere") })
    } else {
      setStatus({ message: t("imageDropMessage") })
    }
  }, [isDragActive, isDragReject])

  return (
    <DropzoneContainer
      {...getRootProps()}
      isDragActive={isDragActive}
      isDragAccept={isChrome || isDragAccept}
      error={status.error}
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
