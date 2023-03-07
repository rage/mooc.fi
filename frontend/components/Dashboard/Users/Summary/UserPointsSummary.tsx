import { useMemo } from "react"

import { orderBy } from "lodash"

import { styled } from "@mui/material/styles"

import CourseEntry, { SkeletonCourseEntry } from "./CourseEntry"
import { SortOrder, UserCourseSummarySort } from "./types"
import { UserPointsSummaryProvider } from "./UserPointsSummaryContext"
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

interface UserPointsSummaryProps {
  data?: UserCourseSummaryCoreFieldsFragment[] | null
  loading?: boolean
  search?: EditorCoursesQueryVariables["search"]
  sort?: UserCourseSummarySort
  order?: SortOrder
}

function flipOrder(order: SortOrder) {
  return order === "asc" ? "desc" : "asc"
}

function UserPointsSummary({
  data,
  loading,
  search,
  sort,
  order = "asc",
}: UserPointsSummaryProps) {
  const t = useTranslator(CommonTranslations)

  // TODO: add search from other fields?
  const filteredData = useMemo(() => {
    if (!data) {
      return []
    }

    let sortedData: typeof data

    switch (sort) {
      case "activity_date":
        sortedData = orderBy(
          data,
          [
            (entry) =>
              orderBy(entry.exercise_completions ?? [], "updated_at")?.pop()
                ?.updated_at ?? "2999-01-01",
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      case "completion_date":
        sortedData = orderBy(
          data,
          [
            (entry) => entry.completion?.updated_at ?? "2999-01-01",
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      default:
        sortedData = orderBy(data, "course.name", order)
        break
    }

    if (!search) {
      return sortedData
    }

    return sortedData?.filter((entry) =>
      entry?.course?.name
        .trim()
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    )
  }, [search, order, sort, data])

  if (loading) {
    return (
      <>
        <SkeletonCourseEntry key="skeleton-course-1" />
        <SkeletonCourseEntry key="skeleton-course-2" />
        <SkeletonCourseEntry key="skeleton-course-3" />
      </>
    )
  }

  return (
    <UserPointsSummaryProvider value={filteredData}>
      {filteredData?.length === 0 && (
        <DataPlaceholder>{t("noResults")}</DataPlaceholder>
      )}
      {filteredData.map((entry, index) => (
        <CourseEntry key={entry.course?.id ?? index} data={entry} />
      ))}
    </UserPointsSummaryProvider>
  )
}

export default UserPointsSummary
