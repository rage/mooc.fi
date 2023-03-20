import { Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import ClipboardButton from "/components/ClipboardButton"
import { useClipboard } from "/hooks/useClipboard"

interface InfoRowProps {
  title: string
  content: string | JSX.Element
  fullWidth?: boolean
  copyable?: boolean
}

const Row = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`

export const InfoRowContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "fullWidth",
})<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: baseline;
  width: ${(props) => (props.fullWidth ? "100" : "80")}%;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const InfoRowTitle = styled(Typography)`
  color: #666;
`

const InfoRowContent = styled(Typography)`
  margin-left: auto;
  font-weight: 600;
  text-align: right;
  @media (max-width: 600px) {
    margin-left: 0;
  }
`

const InfoRowElementContent = styled("div")`
  margin-left: auto;
`

const isElement = (
  content: string | number | JSX.Element,
): content is JSX.Element =>
  typeof content !== "string" && typeof content !== "number"

const InfoRow = ({
  title,
  content,
  copyable,
  fullWidth = false,
  ...typographyProps
}: InfoRowProps & TypographyProps) => {
  const { hasClipboard } = useClipboard(content)

  return (
    <InfoRowContainer fullWidth={fullWidth}>
      <InfoRowTitle variant="h4" {...typographyProps}>
        {title}
      </InfoRowTitle>
      {isElement(content) ? (
        <InfoRowElementContent>{content}</InfoRowElementContent>
      ) : (
        <Row>
          <InfoRowContent variant="h4" {...typographyProps}>
            {content}
          </InfoRowContent>
          {hasClipboard && copyable && <ClipboardButton content={content} />}
        </Row>
      )}
    </InfoRowContainer>
  )
}

export default InfoRow
