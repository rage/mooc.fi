import Image from "next/image"

import styled from "@emotion/styled"
import { ButtonBase, Tooltip } from "@mui/material"

const CloseButton = styled(ButtonBase)`
  position: absolute;
  top: -10px;
  right: 20px;
  border-radius: 10em;
  padding: 2px 6px 3px;
  text-decoration: none;
  font: 700 21px/20px sans-serif;
  background: #555;
  border: 3px solid #fff;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  -webkit-transition: background 0.5s;
  transition: background 0.5s;
  margin-bottom: 2px;

  :hover {
    background: #e54e4e;
    padding: 3px 7px 5px;
    margin-bottom: -1px;
    top: -11px;
    right: 21px;
  }

  :active {
    background: #e54e4e;
    top: -10px;
    right: 210x;
  }
`

const ImagePreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
`
interface ImagePreviewProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  file: string | undefined
  onClose:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | null
  height?: number
}

const ImagePreview = ({
  file,
  onClose = null,
  height,
  ...rest
}: ImagePreviewProps) => {
  if (!file) {
    return null
  }

  return (
    <ImagePreviewContainer {...rest}>
      <Image
        src={file}
        alt={file.length > 64 ? "Image preview" : file} // don't spout gibberish if it's a base64
        fill
        style={{ objectFit: "contain" }}
      />
      {onClose && (
        <Tooltip title="Remove picture">
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Tooltip>
      )}
    </ImagePreviewContainer>
  )
}

export default ImagePreview
