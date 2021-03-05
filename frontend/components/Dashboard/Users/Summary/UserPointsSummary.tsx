import CourseEntry from "./CourseEntry"
import { sortBy } from "lodash"
import { UserSummary_user_course_statistics } from "/static/types/generated/UserSummary"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "/components/Dashboard/Users/Summary/CollapseContext"
import { Paper } from "@material-ui/core"
import CollapseButton from "/components/Buttons/CollapseButton"
import { useTranslator } from "/util/useTranslator"
import CommonTranslations from "/translations/common"

interface UserPointsSummaryProps {
  data?: UserSummary_user_course_statistics[]
  search?: string
}

export default function UserPointsSummary({
  data,
  search,
}: UserPointsSummaryProps) {
  const t = useTranslator(CommonTranslations)
  const { state, dispatch } = useCollapseContext()

  if (!data) {
    return (
      <>
        <CourseEntry key="skeleton-course-1" />
        <CourseEntry key="skeleton-course-2" />
        <CourseEntry key="skeleton-course-3" />
      </>
    )
  }

  // TODO: add search from other fields?
  const filteredData =
    search && search !== ""
      ? data.filter((stats) =>
          stats?.course?.name
            .trim()
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
        )
      : data
  const coursesClosed = !Object.values(state).some((s) => s.open)

  return (
    <>
      <Paper
        style={{
          marginBottom: "0.5rem",
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <CollapseButton
          onClick={() =>
            dispatch({
              type: coursesClosed ? ActionType.OPEN_ALL : ActionType.CLOSE_ALL,
              collapsable: CollapsablePart.COURSE,
            })
          }
          open={!coursesClosed}
          label={coursesClosed ? t("showAll") : t("hideAll")}
        />
      </Paper>
      {filteredData.length === 0 ? <div>No data</div> : null}
      {sortBy(filteredData, (stats) => stats?.course?.name).map((entry) => (
        <CourseEntry
          key={entry.course?.id ?? Math.random() * 9999}
          data={entry}
        />
      ))}
    </>
  )
}
