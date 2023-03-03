import { useMemo } from "react"

import { sortBy } from "lodash"

import { styled } from "@mui/material/styles"

import CourseEntry, { SkeletonCourseEntry } from "./CourseEntry"
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
  search?: EditorCoursesQueryVariables["search"]
}

function UserPointsSummary({ data, search }: UserPointsSummaryProps) {
  const t = useTranslator(CommonTranslations)

  // TODO: add search from other fields?
  const filteredData = useMemo(() => {
    if (!data) {
      return []
    }

    if (!search) {
      return sortBy(data, "course.name")
    }

    return sortBy(
      data?.filter((entry) =>
        entry?.course?.name
          .trim()
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
      ),
      "course.name",
    )
  }, [search, data])

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
