import { Paper, PaperProps, TableCell, TableRow } from "@mui/material"
import { styled } from "@mui/material/styles"

export const SummaryCardContainer = styled((props: PaperProps) => (
  <Paper component="article" elevation={2} {...props} />
))`
  margin-bottom: 1rem;
`

export function SummaryCard({ children, ...props }: PaperProps) {
  return <SummaryCardContainer {...props}>{children}</SummaryCardContainer>
}

export const CollapseTableCell = styled(TableCell)`
  padding-top: 0;
  padding-bottom: 0;
`

export const CollapseTableRow = styled(TableRow)`
  & > tr {
    border-bottom: unset;
  }
`
