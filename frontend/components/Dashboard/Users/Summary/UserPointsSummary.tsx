import { useMemo, useState } from "react"

import { sortBy } from "lodash"

import BuildIcon from "@mui/icons-material/Build"
import { Button, Dialog, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

import { SkeletonCourseEntry } from "./CourseEntry"
import CollapseButton from "/components/Buttons/CollapseButton"
import {
  ActionType,
  CollapsablePart,
  useCollapseContext,
} from "/components/Dashboard/Users/Summary/CollapseContext"
import CourseList from "/components/Dashboard/Users/Summary/CourseList"
import RawView from "/components/Dashboard/Users/Summary/RawView"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

import {
  EditorCoursesQueryVariables,
  UserCourseSummaryCoreFieldsFragment,
} from "/graphql/generated"

const DataPlaceholder = styled("div")`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

const HideOverflow = styled("div")`
  overflow-y: hidden;
`

const ToolbarContainer = styled(Paper)`
  display: flex;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.5rem;
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

  // TODO: add search from other fields?
  const filteredData = useMemo(() => {
    if (!data) {
      return []
    }

    if (!search) {
      return sortBy(data, "course.name")
    }

    return sortBy(
      data?.filter(
        (entry) =>
          entry?.course?.name
            .trim()
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()),
        "course.name",
      ),
    )
  }, [search, data])
  const allCoursesClosed = useMemo(
    () => !Object.values(state).some((s) => s.open),
    [state],
  )

  if (!data) {
    return (
      <>
        <SkeletonCourseEntry key="skeleton-course-1" />
        <SkeletonCourseEntry key="skeleton-course-2" />
        <SkeletonCourseEntry key="skeleton-course-3" />
      </>
    )
  }

  return (
    <>
      <ToolbarContainer>
        <Button
          variant="outlined"
          startIcon={<BuildIcon />}
          onClick={() => setRawViewOpen(!rawViewOpen)}
        >
          Raw view
        </Button>
        <CollapseButton
          onClick={() =>
            dispatch({
              type: allCoursesClosed
                ? ActionType.OPEN_ALL
                : ActionType.CLOSE_ALL,
              collapsable: CollapsablePart.COURSE,
            })
          }
          open={!allCoursesClosed}
          label={allCoursesClosed ? t("showAll") : t("hideAll")}
        />
      </ToolbarContainer>
      {filteredData?.length === 0 && (
        <DataPlaceholder>{t("noResults")}</DataPlaceholder>
      )}
      <CourseList data={filteredData} />
      <Dialog
        fullWidth
        maxWidth="md"
        open={rawViewOpen}
        onClose={() => setRawViewOpen(false)}
      >
        <HideOverflow>
          <RawView value={JSON.stringify(data, undefined, 2)} />
        </HideOverflow>
      </Dialog>
    </>
  )
}
