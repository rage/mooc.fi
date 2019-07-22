import * as React from "react"
import { ButtonBase } from "@material-ui/core"
import styled from "styled-components"

const CloseButton = styled(ButtonBase)`
  position: relative;
  top: -10px;
  right: -10px;
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

  :hover {
    background: #e54e4e;
    padding: 3px 7px 5px;
    top: -11px;
    right: -11px;
  }

  :active {
    background: #e54e4e;
    top: -10px;
    right: -11px;
  }
`

const ImagePreview = ({
  file,
  onClose = null,
  height = 250,
}: {
  file: string | undefined
  onClose: Function | null
  height?: number
}) => {
  if (!file) {
    return null
  }

  return (
    <div>
      {onClose && (
        <CloseButton onClick={(e: React.MouseEvent) => onClose(e)}>
          &times;
        </CloseButton>
      )}
      <img src={file} height={height} />
    </div>
  )
}

export default ImagePreview
