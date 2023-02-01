import { useMemo } from "react"

import { sortBy } from "lodash"

import { styled } from "@mui/material/styles"

import { SkeletonCourseEntry } from "./CourseEntry"
import CourseList from "/components/Dashboard/Users/Summary/CourseList"
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
      {filteredData?.length === 0 && (
        <DataPlaceholder>{t("noResults")}</DataPlaceholder>
      )}
      <CourseList data={filteredData} />
    </>
  )
}

export default UserPointsSummary
