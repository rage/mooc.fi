import { gql, useQuery } from "@apollo/client"
import withAdmin from "/lib/with-admin"
import {
  UserPointsList,
  UserPointsList_user_exercise_completions,
  UserPointsList_user_user_course_progresses,
} from "/static/types/generated/UserPointsList"
import { useQueryParameter } from "/util/useQueryParameter"
import { useEffect, useState } from "react"
import { CircularProgress } from "@material-ui/core"
import { sortBy } from "lodash"
import CourseEntry from "/components/Dashboard/Users/Points/CourseEntry"
import Container from "/components/Container"

// TODO: might as well query completions (and registered)
const UserPointsQuery = gql`
  query UserPointsList($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      user_course_progresses {
        id
        course_id
        max_points
        n_points
        progress
        extra
      }
      exercise_completions {
        id
        created_at
        updated_at
        n_points
        attempted
        completed
        timestamp
        n_points
        exercise_completion_required_actions {
          id
          value
        }
        exercise {
          id
          name
          custom_id
          course {
            id
            name
          }
          part
          section
          max_points
        }
      }
    }
  }
`

interface DataPerCourse {
  progress?: UserPointsList_user_user_course_progresses
  exerciseCompletions: UserPointsList_user_exercise_completions[]
}

function UserPoints() {
  const id = useQueryParameter("id")
  const [groupedData, setGroupedData] = useState<
    [string, DataPerCourse][] | null
  >(null)
  const { loading, /* error, */ data } = useQuery<UserPointsList>(
    UserPointsQuery,
    { variables: { upstream_id: Number(id) } },
  )

  useEffect(() => {
    console.log("data", data)
    // TODO: probably a more readable solution if it gets complicated
    const dataPerCourse =
      data?.user?.exercise_completions?.reduce<Record<string, DataPerCourse>>(
        (acc, curr) => ({
          ...acc,
          ...(curr?.exercise?.course?.id
            ? {
                [curr.exercise.course.id]: {
                  progress: data?.user?.user_course_progresses?.find(
                    (p) => p.course_id === curr.exercise.course.id,
                  ),
                  exerciseCompletions: sortBy(
                    (
                      acc[curr.exercise.course.id]?.exerciseCompletions ?? []
                    ).concat(curr),
                    ["exercise.part", "exercise.section", "exercise.name"],
                  ),
                },
              }
            : {}),
        }),
        {},
      ) ?? {}
    setGroupedData(
      sortBy(
        Object.entries(dataPerCourse),
        ([_, value]) =>
          value?.exerciseCompletions?.[0].exercise?.course?.name ?? "",
      ),
    )
  }, [data])

  return (
    <Container>
      {loading || !groupedData ? (
        <CircularProgress />
      ) : (
        groupedData.map(([id, data]) => <CourseEntry key={id} data={data} />)
      )}
    </Container>
  )
}

export default withAdmin(UserPoints)
