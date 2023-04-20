import { MRT_ColumnDef } from "material-react-table"
import dynamic from "next/dist/shared/lib/dynamic"

import LinkIcon from "@fortawesome/fontawesome-free/svgs/solid/link.svg?icon"
import { Paper, PaperProps, Skeleton, TableCell, TableRow } from "@mui/material"
import { css, styled } from "@mui/material/styles"

export const iconStyle = css`
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

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

export const Spacer = styled("div")`
  flex-grow: 1;
`

export const LinkIconComponent = () => <LinkIcon css={iconStyle} />

export const MUIDataTable = dynamic(() => import("mui-datatables"), {
  ssr: false,
  loading: () => (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  ),
})

export const MaterialReactTable = dynamic(
  () => import("material-react-table"),
  {
    ssr: false,
    loading: () => (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    ),
  },
)
export const ExpandButton = dynamic(
  () => import("mui-datatables").then((mod) => mod.ExpandButton),
  {
    loading: () => (
      <div style={{ width: "24px" }}>
        <Skeleton />
      </div>
    ),
  },
)

export const ExpandButtonPlaceholder = styled("div")`
  width: 24px;
`
