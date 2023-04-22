import { Typography, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useCollapseContext } from "./contexts/CollapseContext"
import { useUserPointsSummaryContext } from "./contexts/UserPointsSummaryContext"
import { CourseEntry, CourseEntrySkeleton } from "./Course"
import CourseSelectList from "./CourseSelectList"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const UserPointsSummaryContainer = styled("div")`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`

function UserPointsSummary() {
  const { data, loading } = useUserPointsSummaryContext()
  const { state } = useCollapseContext()
  const isNarrow = useMediaQuery("(max-width: 800px)")
  const t = useTranslator(CommonTranslations)

  return (
    <UserPointsSummaryContainer>
      {!isNarrow && <CourseSelectList />}
      {loading || state.loading ? (
        <CourseEntrySkeleton />
      ) : data?.length === 0 ? (
        <Typography variant="h3" margin="0.5rem" p="0.5rem">
          {t("noResults")}
        </Typography>
      ) : (
        <CourseEntry />
      )}
      {/*filteredData.map((entry, index) => (
            <CourseEntry key={entry.course?.id ?? index} data={entry} />
          ))*/}
    </UserPointsSummaryContainer>
  )
}

export default UserPointsSummary
