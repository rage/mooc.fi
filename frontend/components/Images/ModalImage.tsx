import { useCallback, useId, useRef, useState } from "react"

import dynamic from "next/dynamic"
import Image, { ImageProps } from "next/image"

import CloseIcon from "@mui/icons-material/Close"
import { Box, IconButton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const ImageContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "width" && prop !== "height",
})<{ width?: string; height?: string }>`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};

  @supports not (aspect-ratio: 16 / 9) {
    ::before {
      content: "";
      float: left;
      padding-top: 56.25%;
    }

    ::after {
      clear: left;
      content: "";
      display: block;
    }
  }

  @supports (aspect-ratio: 16 / 9) {
    aspect-ratio: 16 / 9;
  }
`

const Modal = dynamic(() => import("@mui/material/Modal"), { ssr: false })

const MainImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;

  :hover {
    cursor: zoom-in;
  }
`

const ModalContainer = styled(Box)`
  padding: 2rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: white;
`

const StyledModal = styled(Modal)`
  display: flex;
`

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
`

interface ModalImageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  src: ImageProps["src"]
  alt: ImageProps["alt"]
  width?: string
  height?: string
}

const ModalImage = ({ src, alt, ...props }: ModalImageProps) => {
  const t = useTranslator(CommonTranslations)
  const [open, setOpen] = useState(false)
  const modalLoaded = useRef(false)
  const handleOpen = useCallback(() => {
    modalLoaded.current = true
    setOpen(true)
  }, [setOpen])
  const handleClose = useEventCallback(() => setOpen(false))
  const isStatic = typeof src !== "string"
  const modalId = useId()

  return (
    <ImageContainer {...props}>
      <MainImage
        src={src}
        {...(isStatic ? { placeholder: "blur" } : {})}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onClick={handleOpen}
      />
      {modalLoaded.current && (
        <StyledModal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          aria-describedby={modalId}
        >
          <ModalContainer>
            <Image
              src={src}
              {...(isStatic ? { placeholder: "blur" } : {})}
              placeholder="blur"
              alt={alt}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Typography id={modalId} variant="caption">
              {alt}
            </Typography>
            <StyledIconButton aria-label={t("close")} onClick={handleClose}>
              <CloseIcon />
            </StyledIconButton>
          </ModalContainer>
        </StyledModal>
      )}
    </ImageContainer>
  )
}

export default ModalImage
