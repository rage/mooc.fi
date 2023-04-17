import ClipboardIcon from "@fortawesome/fontawesome-free/svgs/regular/clipboard.svg?icon"
import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import { IconButton, IconButtonProps, Tooltip } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { useClipboard } from "/hooks/useClipboard"

const StyledIconButton = styled(IconButton)`
  transition: all 1s ease-ease-in-out;
`

const iconStyle = css`
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

interface ClipboardProps extends IconButtonProps {
  content: unknown
  tooltipText?: string
  tooltipCopiedText?: string
  SuccessIcon?: () => JSX.Element
  Icon?: () => JSX.Element
}

const DefaultSuccessIcon = () => <CheckIcon css={iconStyle} color="success" />
const DefaultIcon = () => <ClipboardIcon css={iconStyle} />

const ClipboardButton = ({
  content,
  tooltipText = "Copy to clipboard",
  tooltipCopiedText = "Copied!",
  SuccessIcon = DefaultSuccessIcon,
  Icon = DefaultIcon,
  ...props
}: ClipboardProps) => {
  const { hasClipboard, isCopied, onCopyToClipboard } = useClipboard(content)

  return (
    <Tooltip title={isCopied ? tooltipCopiedText : tooltipText}>
      <StyledIconButton onClick={onCopyToClipboard} {...props}>
        {isCopied && hasClipboard ? <SuccessIcon /> : <Icon />}
      </StyledIconButton>
    </Tooltip>
  )
}

export default ClipboardButton
