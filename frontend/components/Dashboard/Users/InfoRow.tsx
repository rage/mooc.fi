import { Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import ClipboardButton from "/components/ClipboardButton"
import { useClipboard } from "/hooks/useClipboard"

type InfoRowProps = {
  title: string
  data: JSX.Element | string
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
})<{ fullWidth?: boolean }>(
  ({ theme, fullWidth }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: baseline;
  width: ${fullWidth ? "100" : "80"}%;

  ${theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: flex-start;
  }
`,
)

const InfoRowTitle = styled(Typography)`
  color: #666;
`

const InfoRowContent = styled(Typography)(
  ({ theme }) => `
  margin-left: auto;
  font-weight: 600;
  text-align: right;

  ${theme.breakpoints.down("sm")} {
    margin-left: 0;
  }
`,
)

const InfoRowElementContent = styled("div")`
  margin-left: auto;
`

const isElement = (data: string | number | JSX.Element): data is JSX.Element =>
  typeof data !== "string" && typeof data !== "number"

const InfoRow = ({
  title,
  data,
  copyable,
  fullWidth = false,
  ...typographyProps
}: InfoRowProps & TypographyProps) => {
  const { hasClipboard } = useClipboard(data)

  return (
    <InfoRowContainer fullWidth={fullWidth}>
      <InfoRowTitle variant="h4" {...typographyProps}>
        {title}
      </InfoRowTitle>
      {isElement(data) ? (
        <InfoRowElementContent>{data}</InfoRowElementContent>
      ) : (
        <Row>
          <InfoRowContent variant="h4" {...typographyProps}>
            {data}
          </InfoRowContent>
          {hasClipboard && copyable && <ClipboardButton data={data} />}
        </Row>
      )}
    </InfoRowContainer>
  )
}

export default InfoRow
