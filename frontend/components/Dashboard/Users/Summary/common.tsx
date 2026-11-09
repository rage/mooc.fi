import LinkIcon from "@fortawesome/fontawesome-free/svgs/solid/link.svg?icon"
import { Paper, PaperProps, TableCell, TableRow } from "@mui/material"
import { css, styled } from "@mui/material/styles"

export const iconStyle = css`
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

const SummaryCardContainer = styled(Paper)`
  margin-bottom: 1rem;
` as typeof Paper

export const SummaryCard = (props: PaperProps) => (
  <SummaryCardContainer component="article" elevation={2} {...props} />
)

export const CollapseTableCell = styled(TableCell)`
  padding-top: 0;
  padding-bottom: 0;
  border-bottom: unset;
`

export const CollapseTableRow = styled(TableRow)`
  & > tr {
    border-bottom: unset;
  }
`

export const Spacer = styled("div")`
  flex-grow: 1;
`

export const LinkIconComponent = () => <LinkIcon css={iconStyle} />
