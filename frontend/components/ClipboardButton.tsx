import ClipboardIcon from "@fortawesome/fontawesome-free/svgs/regular/clipboard.svg?icon"
import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import { IconButton, Tooltip } from "@mui/material"
import { css, styled } from "@mui/material/styles"

const StyledIconButton = styled(IconButton)`
  transition: all 1s ease-ease-in-out;

  :not(disabled):hover {
    cursor: pointer;
  }
`
const iconStyle = css`
  fill: #666;
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

interface ClipboardButtonProps {
  isCopied?: boolean
  onClick: () => void
  disabled?: boolean
}

const ClipboardButton = ({
  isCopied,
  onClick,
  disabled,
}: ClipboardButtonProps) => (
  <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"}>
    <span>
      <StyledIconButton onClick={onClick}>
        {isCopied && !disabled ? (
          <CheckIcon css={iconStyle} />
        ) : (
          <ClipboardIcon css={iconStyle} />
        )}
      </StyledIconButton>
    </span>
  </Tooltip>
)

export default ClipboardButton
