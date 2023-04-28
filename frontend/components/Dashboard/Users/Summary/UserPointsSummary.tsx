import { Backdrop, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useUserPointsSummaryContext } from "./contexts"
import { useCollapseContext } from "./contexts/CollapseContext"
import { CourseEntry, CourseEntrySkeleton } from "./Course"
import CourseSelectList from "./CourseSelectList"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

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
  const { loading, courseLoading } = useUserPointsSummaryContext()
  const { state } = useCollapseContext()
  const isNarrow = useMediaQuery("(max-width: 800px)")
  const t = useTranslator(CommonTranslations)

  return (
    <UserPointsSummaryContainer>
      {!isNarrow && <CourseSelectList />}
      <div style={{ position: "relative" }}>
        <Backdrop
          open={courseLoading ?? false}
          sx={{ position: "absolute", color: "#888", zIndex: 10 }}
        />
        {loading || state.loading ? (
          <CourseEntrySkeleton />
        ) : (
          /*data?.length === 0 ? (
        <Typography variant="h3" margin="0.5rem" p="0.5rem">
          {t("noResults")}
        </Typography>
      ) : */ <CourseEntry />
        )}
      </div>
      {/*filteredData.map((entry, index) => (
            <CourseEntry key={entry.course?.id ?? index} data={entry} />
          ))*/}
    </UserPointsSummaryContainer>
  )
}

export default UserPointsSummary
