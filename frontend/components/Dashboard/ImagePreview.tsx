import { MouseEvent as ReactMouseEvent } from "react"

import styled from "@emotion/styled"
import { ButtonBase, Tooltip } from "@mui/material"

const CloseButton = styled(ButtonBase)`
  position: relative;
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

interface ImagePreviewProps {
  file: string | undefined
  onClose: Function | null
  height?: number
  [key: string]: any
}

const ImagePreview = ({
  file,
  onClose = null,
  height = 250,
  ...rest
}: ImagePreviewProps) => {
  if (!file) {
    return null
  }

  return (
    <div {...rest}>
      <img
        src={file}
        height={height}
        alt={file} // TODO: might be gibberish if base64 image
      />
      {onClose && (
        <Tooltip title="Remove picture">
          <CloseButton onClick={(e: ReactMouseEvent) => onClose(e)}>
            &times;
          </CloseButton>
        </Tooltip>
      )}
    </div>
  )
}

export default ImagePreview
