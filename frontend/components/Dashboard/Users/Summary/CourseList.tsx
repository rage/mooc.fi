import { useCollapseContext } from "/components/Dashboard/Users/Summary/CollapseContext"
import CourseEntry from "/components/Dashboard/Users/Summary/CourseEntry"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface CourseListProps {
  data?: Array<UserCourseSummaryCoreFieldsFragment>
}

function CourseList({ data }: CourseListProps) {
  const { state, dispatch } = useCollapseContext()

  if (!data) {
    return null
  }

  return (
    <>
      {data.map((entry, index) => {
        /*if ((entry.tier_summaries?.length ?? 0) > 0) {
          return (
            <HandlerCourseEntry
              key={entry.course?.id ?? index}
              data={entry}
              state={state[entry.course?.id ?? ""]}
              dispatch={dispatch}
            />
          )
        }*/
        return (
          <CourseEntry
            key={entry.course?.id ?? index}
            data={entry}
            state={state[entry.course?.id ?? ""]}
            dispatch={dispatch}
          />
        )
      })}
    </>
  )
}

export default CourseList
