import { useMemo } from "react"

import { MaterialReactTableProps } from "material-react-table"
import dynamic from "next/dynamic"

import LinkIcon from "@fortawesome/fontawesome-free/svgs/solid/link.svg?icon"
import {
  NoSsr,
  Paper,
  PaperProps,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { MRT_Localization_FI } from "/lib/locale"

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

export const MaterialReactTable = dynamic(
  () => import("material-react-table"),
  {
    ssr: false,
    loading: () => (
      <NoSsr>
        <TableContainer>
          <Table key="loading">
            <TableBody>
              {[...Array(10)].map((i) => (
                <TableRow key={i}>
                  <TableCell width={20}>
                    <Skeleton animation="wave" height={20} width={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton animation="wave" height={20} width="100%" />
                  </TableCell>
                  <TableCell width={20}>
                    <Skeleton animation="wave" height={20} width={20} />
                  </TableCell>
                  <TableCell width={20}>
                    <Skeleton animation="wave" height={20} width={20} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </NoSsr>
    ),
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
) as <TData extends Record<string, any> = {}>(
  props: MaterialReactTableProps<TData>,
) => JSX.Element

export const useMaterialReactTableLocalization = (locale?: string) => {
  return useMemo(() => {
    if (locale === "fi") {
      return MRT_Localization_FI
    }

    return
  }, [locale])
}
