import { useCallback, useState } from "react"

import ClipboardIcon from "@fortawesome/fontawesome-free/svgs/regular/clipboard.svg?icon"
import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import { IconButton, Tooltip, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

interface InfoRowProps {
  title: string
  content: string
}

const isClipboardSupported =
  typeof window !== "undefined" && navigator?.clipboard

const StyledIconButton = styled(IconButton)`
  transition: all 1s ease-ease-in-out;
`

export const InfoRowContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: baseline;
  width: 80%;
`

const InfoRowTitle = styled(Typography)`
  color: #666;
`

const InfoRowContent = styled(Typography)`
  margin-left: auto;
  font-weight: 600;
`

const iconStyle = css`
  fill: #666;
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

const InfoRow = ({ title, content }: InfoRowProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [content])

  return (
    <InfoRowContainer>
      <InfoRowTitle variant="h4">{title}</InfoRowTitle>
      <InfoRowContent variant="h4">{content}</InfoRowContent>
      {isClipboardSupported && (
        <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"}>
          <StyledIconButton onClick={onCopyToClipboard}>
            {isCopied ? (
              <CheckIcon css={iconStyle} />
            ) : (
              <ClipboardIcon css={iconStyle} />
            )}
          </StyledIconButton>
        </Tooltip>
      )}
    </InfoRowContainer>
  )
}

export default InfoRow
