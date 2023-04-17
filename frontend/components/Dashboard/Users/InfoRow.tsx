import { useCallback, useState } from "react"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import ClipboardButton from "../../ClipboardButton"

interface InfoRowProps {
  title: string
  content: string
}

const isClipboardSupported =
  typeof window !== "undefined" && navigator?.clipboard

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

const InfoRow = ({ title, content }: InfoRowProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopyToClipboard = useCallback(() => {
    if (!isClipboardSupported) {
      return
    }

    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [content])

  return (
    <InfoRowContainer>
      <InfoRowTitle variant="h4">{title}</InfoRowTitle>
      <InfoRowContent variant="h4">{content}</InfoRowContent>
      <ClipboardButton
        isCopied={isCopied}
        disabled={!isClipboardSupported}
        onClick={onCopyToClipboard}
      />
    </InfoRowContainer>
  )
}

export default InfoRow
