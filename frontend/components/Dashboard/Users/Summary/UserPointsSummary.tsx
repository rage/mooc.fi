import { useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useUserPointsSummaryContext } from "./contexts"
import { useCollapseContext } from "./contexts/CollapseContext"
import { CourseEntry, CourseEntrySkeleton } from "./Course"
import CourseSelectList from "./CourseSelectList"

const UserPointsSummaryContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  gap: 1rem;

  ${theme.breakpoints.down("lg")} {
    flex-direction: column;
  }
`,
)

function UserPointsSummary() {
  const { loading } = useUserPointsSummaryContext()
  const { state } = useCollapseContext()
  const isNarrow = useMediaQuery("(max-width: 800px)")

  return (
    <UserPointsSummaryContainer>
      {!isNarrow && <CourseSelectList />}
      {loading || state.loading ? (
        <CourseEntrySkeleton />
      ) : (
        /*data?.length === 0 ? (
        <Typography variant="h3" margin="0.5rem" p="0.5rem">
          {t("noResults")}
        </Typography>
      ) : */ <CourseEntry />
      )}
      {/*filteredData.map((entry, index) => (
            <CourseEntry key={entry.course?.id ?? index} data={entry} />
          ))*/}
    </UserPointsSummaryContainer>
  )
}

export default UserPointsSummary
