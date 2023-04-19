import { useCallback, useMemo } from "react"

import {
  type MUIDataTableColumn,
  type MUIDataTableExpandButton,
  type MUIDataTableOptions,
  type MUIDataTableProps,
} from "mui-datatables"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { css } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import { Translator } from "/translations"
import ProfileTranslations from "/translations/profile"
import { formatDateTime } from "/util/dataFormatFunctions"
import notEmpty from "/util/notEmpty"

import {
  TierProgressExerciseCompletionFieldsFragment,
  TierProgressFieldsFragment,
} from "/graphql/generated"

interface TierExerciseListProps {
  data?: Array<TierProgressFieldsFragment>
  loading?: boolean
}

const iconStyle = css`
  height: 1rem;
`

const MUIDataTable = dynamic(
  () => import("mui-datatables").then((mod) => mod.default),
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
const ExpandButton = dynamic(
  () => import("mui-datatables").then((mod) => mod.ExpandButton),
  {
    loading: () => (
      <div style={{ width: "24px" }}>
        <Skeleton />
      </div>
    ),
  },
)

type ExerciseCompletionRow = TierProgressExerciseCompletionFieldsFragment & {
  id: string
  tier: number | null
  points: string
  completed: boolean | null
  exercise_completion_required_actions: Array<{
    id: string
    value: string
  }>
}

type Row = TierProgressFieldsFragment & {
  id: string
  exercise_number: number
  name: string
  tier: number
  points: string
  exercise_completions: Array<ExerciseCompletionRow>
  completed: boolean
}

const mapExerciseToRow = (exercise: TierProgressFieldsFragment): Row => ({
  ...exercise,
  id: exercise.custom_id ?? "",
  exercise_number: exercise.exercise_number,
  name: exercise.name ?? "",
  tier: exercise.tier,
  points: `${Math.round(exercise.n_points * 100) / 100}/${exercise.max_points}`,
  exercise_completions: (exercise.exercise_completions ?? []).map((ec) => ({
    ...ec,
    points: `${Math.round((ec.n_points ?? 0) * 100) / 100}/${
      ec.max_points ?? 0
    }`,
    exercise_completion_required_actions:
      ec.exercise_completion_required_actions ?? [],
  })),
  completed: true, //exercise.exercise_completions?.some((e) => e.completed) ?? false,
})

interface TierExerciseCompletionProps {
  data: Array<ExerciseCompletionRow>
  highestTier?: number
  points?: number
}

const TierExerciseCompletions = ({
  data,
  highestTier,
  points,
}: TierExerciseCompletionProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Submission date</TableCell>
          <TableCell>Tier</TableCell>
          <TableCell>Points</TableCell>
          <TableCell>Completed</TableCell>
          <TableCell>Required actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((ec) => (
          <TableRow key={ec.id}>
            <TableCell>
              {formatDateTime(ec.timestamp, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </TableCell>
            <TableCell
              style={{
                fontWeight: ec.tier === highestTier ? "800" : undefined,
              }}
            >
              {ec.tier}
            </TableCell>
            <TableCell
              style={{ fontWeight: ec.n_points === points ? "800" : undefined }}
            >
              {ec.points}
            </TableCell>
            <TableCell>{ec.completed ? "true" : "false"}</TableCell>
            <TableCell>
              {ec?.exercise_completion_required_actions.map((action) => (
                // @ts-ignore: translator key
                <Chip key={action.id} label={t(action.value) ?? action.value} />
              )) ?? null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const renderCompleted = (t: Translator<any>) => (value: boolean) =>
  value && (
    <CheckIcon css={iconStyle} color="success" titleAccess={t("completed")} />
  )

const TierExerciseList = ({ data }: TierExerciseListProps) => {
  const { locale } = useRouter()
  const t = useTranslator(ProfileTranslations)

  const columns: Array<MUIDataTableColumn> = useMemo(
    () => [
      {
        name: "exercise_number",
        label: "#",
      },
      {
        name: "name",
        label: "Name",
        width: 300,
      },
      {
        name: "tier",
        label: "Tier",
        width: 25,
      },
      {
        name: "points",
        label: "Points",
      },
      {
        name: "completed",
        label: "Completed",
        width: 25,
        options: {
          customBodyRender: renderCompleted(t),
        },
      },
    ],
    [locale, t],
  )

  const rows = useMemo(() => (data ?? []).map(mapExerciseToRow), [data])

  const createOptions = useCallback(
    (_rows: typeof rows): MUIDataTableOptions => ({
      expandableRows: true,
      pagination: false,
      selectableRows: "none",
      isRowExpandable: (dataIndex) => {
        return (_rows[dataIndex]?.exercise_completions ?? []).length > 0
      },
      renderExpandableRow: (rowData, { rowIndex }) => {
        return (
          <TableRow>
            <TableCell colSpan={rowData.length + 1}>
              <TierExerciseCompletions
                data={_rows[rowIndex].exercise_completions}
                highestTier={_rows[rowIndex].tier}
                points={_rows[rowIndex].n_points}
              />
            </TableCell>
          </TableRow>
        )
      },
    }),
    [rows],
  )

  const ConditionalExpandButton = useCallback(
    (props: MUIDataTableExpandButton) => {
      if (
        !notEmpty(props.dataIndex) ||
        (rows[props.dataIndex]?.exercise_completions ?? []).length == 0
      ) {
        return <div style={{ width: "24px" }} />
      }
      return <ExpandButton {...props} />
    },
    [rows],
  )

  const components: MUIDataTableProps["components"] = useMemo(
    () => ({
      ExpandButton: ConditionalExpandButton,
    }),
    [ConditionalExpandButton],
  )

  return (
    <div style={{ width: "100%" }}>
      <MUIDataTable
        title={<Typography variant="h3">Exercises</Typography>}
        data={rows}
        columns={columns}
        options={createOptions(rows)}
        components={components}
      />
    </div>
  )
}

export default TierExerciseList
