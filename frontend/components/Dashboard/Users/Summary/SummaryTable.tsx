import { ReactNode, useState } from "react"

import ClearIcon from "@mui/icons-material/Clear"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import SearchIcon from "@mui/icons-material/Search"
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material"
import {
  Cell,
  type ColumnHelper,
  columnFilteringFeature,
  columnSizingFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  FlexRender,
  globalFilteringFeature,
  metaHelper,
  type ReactTable,
  Row,
  rowExpandingFeature,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"

import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

interface SummaryColumnMeta {
  headerTooltip?: string
}

const features = tableFeatures({
  columnSizingFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  columnMeta: metaHelper<SummaryColumnMeta>(),
})

type SummaryTableFeatures = typeof features

export const createSummaryColumnHelper = <TData extends object>() =>
  createColumnHelper<SummaryTableFeatures, TData>()

export type SummaryColumns<TData extends object> = ReturnType<
  ColumnHelper<SummaryTableFeatures, TData>["columns"]
>

/** The parts of a cell context that column-agnostic cell renderers read. */
export interface SummaryCellProps<TValue> {
  column: { columnDef: { header?: unknown } }
  getValue: () => TValue
}

/** The header of a column when it's a plain string, for labelling cells in the stacked layout. */
export const getColumnLabel = ({ column }: SummaryCellProps<unknown>) =>
  typeof column.columnDef.header === "string" ? column.columnDef.header : ""

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100]
const DEFAULT_PAGE_SIZE = 30
// Same width unit as the column `size` values; the widths are proportional since the table stretches to fit.
const EXPAND_COLUMN_SIZE = 20
const NARROW_ROW_BORDER = "1px solid rgba(224, 224, 244, 1)"

interface SummaryTableProps<TData extends object> {
  data: Array<TData>
  columns: SummaryColumns<TData>
  title?: ReactNode
  isLoading?: boolean
  isPaginated?: boolean
  isSearchable?: boolean
  /** Rendered below an expanded row. Only shown in the wide layout. */
  renderDetailPanel?: (row: TData) => ReactNode
  getRowCanExpand?: (row: TData) => boolean
  getRowBackgroundColor?: (row: TData) => string | undefined
  /** Removes a cell from the stacked layout instead of showing it empty. */
  isCellHidden?: (cell: Cell<SummaryTableFeatures, TData, unknown>) => boolean
}

interface ExpandToggleProps {
  label: string
  isExpanded: boolean
  onClick: () => void
}

const ExpandToggle = ({ label, isExpanded, onClick }: ExpandToggleProps) => (
  <Tooltip title={label}>
    <IconButton size="small" aria-label={label} onClick={onClick}>
      <ExpandMoreIcon
        sx={{
          transform: isExpanded ? "rotate(-180deg)" : "rotate(-90deg)",
          transition: "transform 150ms",
        }}
      />
    </IconButton>
  </Tooltip>
)

interface SearchToggleProps {
  value: string
  onChange: (value: string) => void
}

const SearchToggle = ({ value, onChange }: SearchToggleProps) => {
  const t = useTranslator(ProfileTranslations)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginLeft: "auto",
      }}
    >
      <Collapse in={isOpen} orientation="horizontal" unmountOnExit>
        <TextField
          size="small"
          autoFocus
          placeholder={t("tableSearch")}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label={t("tableClearSearch")}
                    disabled={!value}
                    onClick={() => onChange("")}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Collapse>
      <Tooltip title={t("tableShowHideSearch")}>
        <IconButton
          aria-label={t("tableShowHideSearch")}
          onClick={() => {
            if (isOpen) {
              onChange("")
            }
            setIsOpen(!isOpen)
          }}
        >
          <SearchIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

interface SummaryTableBodyRowProps<TData extends object> {
  row: Row<SummaryTableFeatures, TData>
  isWide: boolean
  isVeryNarrow: boolean
  columnCount: number
  /** Only passed when the detail panel column is shown. */
  renderDetailPanel?: (row: TData) => ReactNode
  backgroundColor?: string
  isCellHidden?: (cell: Cell<SummaryTableFeatures, TData, unknown>) => boolean
}

function SummaryTableBodyRow<TData extends object>({
  row,
  isWide,
  isVeryNarrow,
  columnCount,
  renderDetailPanel,
  backgroundColor,
  isCellHidden,
}: SummaryTableBodyRowProps<TData>) {
  const t = useTranslator(ProfileTranslations)
  const isExpanded = !!renderDetailPanel && row.getIsExpanded()

  return (
    <>
      <TableRow
        hover={isWide}
        sx={[
          { backgroundColor },
          isWide
            ? isExpanded && {
                "& > td": { borderBottom: "none" },
              }
            : {
                display: "flex",
                flexDirection: "column",
                margin: "0.5rem",
                ...(isVeryNarrow
                  ? { marginBottom: "1rem" }
                  : {
                      border: NARROW_ROW_BORDER,
                      borderRadius: "4px",
                      padding: "0.5rem",
                    }),
              },
        ]}
      >
        {renderDetailPanel && (
          <TableCell padding="none" sx={{ textAlign: "center" }}>
            {row.getCanExpand() && (
              <ExpandToggle
                label={isExpanded ? t("tableCollapse") : t("tableExpand")}
                isExpanded={isExpanded}
                onClick={row.getToggleExpandedHandler()}
              />
            )}
          </TableCell>
        )}
        {row
          .getAllCells()
          .filter((cell) => isWide || !isCellHidden?.(cell))
          .map((cell) => (
            <TableCell
              key={cell.id}
              sx={
                isWide
                  ? undefined
                  : {
                      display: "block",
                      width: "100%",
                      borderBottom: NARROW_ROW_BORDER,
                    }
              }
            >
              <FlexRender cell={cell} />
            </TableCell>
          ))}
      </TableRow>
      {renderDetailPanel && row.getCanExpand() && (
        <TableRow sx={{ backgroundColor }}>
          <TableCell
            colSpan={columnCount}
            sx={{
              paddingY: 0,
              ...(!isExpanded && { borderBottom: "none" }),
            }}
          >
            <Collapse in={isExpanded} unmountOnExit>
              {renderDetailPanel(row.original)}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

interface SummaryTableHeadProps<TData extends object> {
  table: ReactTable<SummaryTableFeatures, TData>
  hasDetailPanel: boolean
}

function SummaryTableHead<TData extends object>({
  table,
  hasDetailPanel,
}: SummaryTableHeadProps<TData>) {
  const t = useTranslator(ProfileTranslations)
  const headerGroups = table.getHeaderGroups()
  const isAllExpanded = table.getIsAllRowsExpanded()

  return (
    <>
      <colgroup>
        {hasDetailPanel && <col style={{ width: EXPAND_COLUMN_SIZE }} />}
        {table.getAllLeafColumns().map((column) => (
          <col key={column.id} style={{ width: column.getSize() }} />
        ))}
      </colgroup>
      <TableHead>
        {headerGroups.map((headerGroup, groupIndex) => (
          <TableRow key={headerGroup.id}>
            {hasDetailPanel && (
              <TableCell padding="none" sx={{ textAlign: "center" }}>
                {groupIndex === headerGroups.length - 1 &&
                  table.getCanSomeRowsExpand() && (
                    <ExpandToggle
                      label={
                        isAllExpanded
                          ? t("tableCollapseAll")
                          : t("tableExpandAll")
                      }
                      isExpanded={isAllExpanded}
                      onClick={() =>
                        table.toggleAllRowsExpanded(!isAllExpanded)
                      }
                    />
                  )}
              </TableCell>
            )}
            {headerGroup.headers.map((header) => {
              const tooltip = header.column.columnDef.meta?.headerTooltip

              return (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  sx={{
                    fontWeight: "bold",
                    verticalAlign: "bottom",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header.isPlaceholder ? null : tooltip ? (
                    <Tooltip title={tooltip}>
                      <Box component="span" sx={{ cursor: "help" }}>
                        <FlexRender header={header} />
                      </Box>
                    </Tooltip>
                  ) : (
                    <FlexRender header={header} />
                  )}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableHead>
    </>
  )
}

/**
 * Table for the user points summary: a regular table on wide screens, rows stacked as cards on narrow
 * ones. Columns that should label their values on narrow screens must render that label themselves.
 */
function SummaryTable<TData extends object>({
  data,
  columns,
  title,
  isLoading = false,
  isPaginated = false,
  isSearchable = false,
  renderDetailPanel,
  getRowCanExpand,
  getRowBackgroundColor,
  isCellHidden,
}: SummaryTableProps<TData>) {
  const t = useTranslator(ProfileTranslations)
  const isWide = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"))
  const isVeryNarrow = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  )

  const table = useTable({
    features,
    columns,
    data,
    defaultColumn: { size: 180 },
    globalFilterFn: "includesString",
    getRowCanExpand: (row: Row<SummaryTableFeatures, TData>) =>
      getRowCanExpand?.(row.original) ?? false,
    initialState: {
      pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
    },
  })

  const hasDetailPanel = isWide && !!renderDetailPanel
  const rows = isPaginated
    ? table.getRowModel().rows
    : table.getPrePaginatedRowModel().rows
  const leafColumnCount =
    table.getAllLeafColumns().length + (hasDetailPanel ? 1 : 0)
  const { pageIndex, pageSize } = table.state.pagination

  const pagination = (
    <TablePagination
      component="div"
      count={table.getPrePaginatedRowModel().rows.length}
      page={pageIndex}
      rowsPerPage={pageSize}
      rowsPerPageOptions={PAGE_SIZE_OPTIONS}
      onPageChange={(_, page) => table.setPageIndex(page)}
      onRowsPerPageChange={(event) =>
        table.setPageSize(Number(event.target.value))
      }
      sx={{
        ".MuiTablePagination-toolbar": {
          padding: "0.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
        },
        ".MuiTablePagination-spacer": { flex: 0 },
      }}
    />
  )

  const toolbar = (title || isSearchable) && (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
        padding: "0.5rem",
      }}
    >
      {title}
      {isSearchable && (
        <SearchToggle
          value={String(table.state.globalFilter ?? "")}
          onChange={(value) => table.setGlobalFilter(value)}
        />
      )}
    </Box>
  )

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        {toolbar}
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%" }}>
      {toolbar}
      {isPaginated && pageSize > 10 && pagination}
      <TableContainer sx={{ width: "100%" }}>
        <Table
          sx={
            isWide
              ? {
                  tableLayout: "fixed",
                  "& .MuiTableCell-root": { paddingX: 1 },
                }
              : { display: "block", "& > tbody": { display: "block" } }
          }
        >
          {isWide && (
            <SummaryTableHead table={table} hasDetailPanel={hasDetailPanel} />
          )}
          <TableBody>
            {rows.length === 0 && (
              <TableRow sx={isWide ? undefined : { display: "block" }}>
                <TableCell
                  colSpan={leafColumnCount}
                  sx={{
                    display: isWide ? undefined : "block",
                    textAlign: "center",
                    fontStyle: "italic",
                    color: "text.secondary",
                    padding: "2rem 1rem",
                  }}
                >
                  {t("tableNoRecords")}
                </TableCell>
              </TableRow>
            )}
            {rows.map((row) => (
              <SummaryTableBodyRow
                key={row.id}
                row={row}
                isWide={isWide}
                isVeryNarrow={isVeryNarrow}
                columnCount={leafColumnCount}
                renderDetailPanel={
                  hasDetailPanel ? renderDetailPanel : undefined
                }
                backgroundColor={getRowBackgroundColor?.(row.original)}
                isCellHidden={isCellHidden}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPaginated && pagination}
    </Box>
  )
}

export default SummaryTable
