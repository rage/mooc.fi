import { useMemo } from "react"

import { useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import { CourseEntry, SkeletonCourseEntry } from "./Course"
import CourseSelectList from "./CourseSelectList"
import { useUserPointsSummaryContext } from "./UserPointsSummaryContext"
import { useUserPointsSummarySelectedCourseContext } from "./UserPointsSummarySelectedCourseContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const DataPlaceholder = styled("div")`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
`

const UserPointsSummaryContainer = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`
interface UserPointsSummaryProps {
  loading?: boolean
}

function UserPointsSummary({ loading }: UserPointsSummaryProps) {
  const { data } = useUserPointsSummaryContext()
  const { selected } = useUserPointsSummarySelectedCourseContext()

  const isNarrow = useMediaQuery("(max-width: 800px)")
  const t = useTranslator(CommonTranslations)

  const selectedCourseData = useMemo(
    () =>
      selected
        ? data?.find((entry) => entry.course?.slug === selected) ?? data?.[0]
        : data?.[0],
    [data, selected],
  )

  return (
    <UserPointsSummaryContainer>
      {!isNarrow && (
        <CourseSelectList
          selected={selectedCourseData?.course?.slug}
          loading={loading}
        />
      )}
      {!loading && data?.length === 0 && (
        <DataPlaceholder>{t("noResults")}</DataPlaceholder>
      )}
      {loading ? (
        <SkeletonCourseEntry />
      ) : (
        selectedCourseData && <CourseEntry data={selectedCourseData} />
      )}
      {/*filteredData.map((entry, index) => (
            <CourseEntry key={entry.course?.id ?? index} data={entry} />
          ))*/}
    </UserPointsSummaryContainer>
  )
}

export default UserPointsSummary
