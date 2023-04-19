import { useCallback } from "react"

import { Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import ClipboardButton from "/components/ClipboardButton"
import { useClipboard } from "/hooks/useClipboard"

type InfoRowProps = {
  title: string
  data?: JSX.Element | string | number
  fullWidth?: boolean
  copyable?: boolean
}

export const InfoRowContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "fullWidth",
})<{ fullWidth?: boolean }>(
  ({ fullWidth }) => `
  display: flex;
  flex-direction: row;
  align-items: baseline;
  align-content: center;
  width: ${fullWidth ? "100" : "80"}%;
  flex-wrap: wrap;
  justify-content: space-between;
`,
)

/*  ${theme.breakpoints.down("sm")} {
    flex-direction: column;
    align-items: flex-start;
  }
*/
const InfoRowTitle = styled(Typography)`
  color: #666;
  font-weight: 600;
  padding-right: 0.5rem;
`

const InfoRowContent = styled(Typography)(
  ({ theme }) => `
  text-align: right;

  ${theme.breakpoints.down("sm")} {
    margin-left: 0;
  }
`,
)

const InfoRowElementContent = styled("div")`
  justify-content: flex-end;
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

  const Content = useCallback(() => {
    if (!data) {
      return null
    }

    if (isElement(data)) {
      return <InfoRowElementContent>{data}</InfoRowElementContent>
    }

    return (
      <InfoRowContent variant="h4" {...typographyProps}>
        {data}
        {hasClipboard && copyable && <ClipboardButton data={data} />}
      </InfoRowContent>
    )
  }, [data, hasClipboard, copyable, typographyProps])

  return (
    <InfoRowContainer fullWidth={fullWidth}>
      <InfoRowTitle variant="h4" {...typographyProps}>
        {title}
        {!data && hasClipboard && copyable && <ClipboardButton data={title} />}
      </InfoRowTitle>
      <Content />
    </InfoRowContainer>
  )
}

export default InfoRow
