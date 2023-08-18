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
      {loading || state.loading ? <CourseEntrySkeleton /> : <CourseEntry />}
    </UserPointsSummaryContainer>
  )
}

export default UserPointsSummary
