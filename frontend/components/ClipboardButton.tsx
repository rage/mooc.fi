import React from "react"

import ClipboardIcon from "@fortawesome/fontawesome-free/svgs/regular/clipboard.svg?icon"
import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import { IconButton, IconButtonProps, Tooltip } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { useClipboard } from "/hooks/useClipboard"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const StyledIconButton = styled(IconButton)`
  transition: all 1s ease-ease-in-out;
`

const iconStyle = css`
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

interface ClipboardProps extends IconButtonProps {
  data: unknown
  tooltipText?: string
  tooltipCopiedText?: string
  SuccessIcon?: () => React.JSX.Element
  Icon?: () => React.JSX.Element
}

const DefaultSuccessIcon = () => <CheckIcon css={iconStyle} color="success" />
const DefaultIcon = () => <ClipboardIcon css={iconStyle} />

const ClipboardButton = ({
  data,
  tooltipText,
  tooltipCopiedText,
  SuccessIcon = DefaultSuccessIcon,
  Icon = DefaultIcon,
  ...props
}: ClipboardProps) => {
  const t = useTranslator(CommonTranslations)

  tooltipText ??= t("copyToClipboard")
  tooltipCopiedText ??= t("copiedToClipboard")

  const { hasClipboard, isCopied, onCopyToClipboard } = useClipboard(data)

  return (
    <span id={`clipboardbutton-${data}`}>
      <Tooltip title={isCopied ? tooltipCopiedText : tooltipText}>
        <StyledIconButton onClick={onCopyToClipboard} {...props}>
          {isCopied && hasClipboard ? <SuccessIcon /> : <Icon />}
        </StyledIconButton>
      </Tooltip>
    </span>
  )
}

export default ClipboardButton
