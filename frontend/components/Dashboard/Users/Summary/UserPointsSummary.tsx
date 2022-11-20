import { useState } from "react"

import { sortBy } from "lodash"

import styled from "@emotion/styled"
import BuildIcon from "@mui/icons-material/Build"
import { Button, Dialog, Paper } from "@mui/material"

import CourseEntry from "./CourseEntry"
import CollapseButton from "/components/Buttons/CollapseButton"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "/components/Dashboard/Users/Summary/CollapseContext"
import RawView from "/components/Dashboard/Users/Summary/RawView"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

import {
  EditorCoursesQueryVariables,
  UserCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

const DataPlaceholder = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

interface UserPointsSummaryProps {
  data?: UserCourseSummaryCoreFieldsFragment[]
  search?: EditorCoursesQueryVariables["search"]
}

export default function UserPointsSummary({
  data,
  search,
}: UserPointsSummaryProps) {
  const t = useTranslator(CommonTranslations)
  const { state, dispatch } = useCollapseContext()
  const [rawViewOpen, setRawViewOpen] = useState(false)

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
          justifyContent: "flex-end",
          flexDirection: "row",
          gap: "0.5rem",
          padding: "0.5rem",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<BuildIcon />}
          aria-controls="raw-view"
          onClick={() => setRawViewOpen(!rawViewOpen)}
        >
          Raw view
        </Button>
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
      {filteredData.length === 0 ? (
        <DataPlaceholder>{t("noResults")}</DataPlaceholder>
      ) : null}
      {sortBy(filteredData, (stats) => stats?.course?.name).map(
        (entry, index) => (
          <CourseEntry key={entry.course?.id ?? index} data={entry} />
        ),
      )}
      <Dialog
        id="raw-view"
        fullWidth
        maxWidth="md"
        open={rawViewOpen}
        onClose={() => setRawViewOpen(false)}
      >
        <div style={{ overflowY: "hidden" }}>
          <RawView value={JSON.stringify(data, undefined, 2)} />
        </div>
      </Dialog>
    </>
  )
}
