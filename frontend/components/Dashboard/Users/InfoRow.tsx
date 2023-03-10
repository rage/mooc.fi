import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import ClipboardButton from "/components/ClipboardButton"
import { useClipboard } from "/hooks/useClipboard"

interface InfoRowProps {
  title: string
  content: string | JSX.Element
  copyable?: boolean
}

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

const InfoRowElementContent = styled("div")`
  margin-left: auto;
`

const isElement = (
  content: string | number | JSX.Element,
): content is JSX.Element =>
  typeof content !== "string" && typeof content !== "number"

const InfoRow = ({ title, content, copyable }: InfoRowProps) => {
  const { hasClipboard } = useClipboard(content)

  return (
    <InfoRowContainer>
      <InfoRowTitle variant="h4">{title}</InfoRowTitle>
      {isElement(content) ? (
        <InfoRowElementContent>{content}</InfoRowElementContent>
      ) : (
        <>
          <InfoRowContent variant="h4">{content}</InfoRowContent>
          {hasClipboard && copyable && <ClipboardButton content={content} />}
        </>
      )}
    </InfoRowContainer>
  )
}

export default InfoRow
