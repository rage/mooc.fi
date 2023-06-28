import { useMemo } from "react"

import { MaterialReactTableProps } from "material-react-table"
import dynamic from "next/dynamic"

import LinkIcon from "@fortawesome/fontawesome-free/svgs/solid/link.svg?icon"
import {
  NoSsr,
  Paper,
  PaperProps,
  Skeleton,
  TableCell,
  TableRow,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { MRT_Localization_FI } from "/lib/locale"

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

export const MaterialReactTable = dynamic(
  () => import("material-react-table"),
  {
    ssr: false,
    loading: () => (
      <NoSsr>
        <Skeleton width="100%" height={400} />
      </NoSsr>
    ),
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
) as <TData extends Record<string, any> = {}>(
  props: MaterialReactTableProps<TData>,
) => React.JSX.Element

export const useMaterialReactTableLocalization = (locale?: string) => {
  return useMemo(() => {
    if (locale === "fi") {
      return MRT_Localization_FI
    }
  }, [locale])
}
