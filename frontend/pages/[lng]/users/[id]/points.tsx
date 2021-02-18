import { gql, useQuery } from "@apollo/client"
import withAdmin from "/lib/with-admin"
import { useQueryParameter } from "/util/useQueryParameter"
import { CircularProgress } from "@material-ui/core"
import UserPointsList from "/components/Dashboard/Users/Points/UserPointsList"
import Container from "/components/Container"
import { CourseStatistics } from "/static/types/generated/CourseStatistics"
import notEmpty from "/util/notEmpty"

const CourseStatisticsQuery = gql`
  query CourseStatistics($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      course_statistics {
        course {
          id
          name
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
        user_course_progresses {
          id
          course_id
          max_points
          n_points
          progress
          extra
        }
        completion {
          id
          course_id
          created_at
          updated_at
          tier
          grade
          project_completion
          completion_language
          completion_date
          registered
          eligible_for_ects
        }
      }
    }
  }
`

function UserPoints() {
  const id = useQueryParameter("id")
  const { loading, /* error, */ data } = useQuery<CourseStatistics>(
    CourseStatisticsQuery,
    { variables: { upstream_id: Number(id) } },
  )

  console.log("data", data)
  console.log("notEmpty", notEmpty)
  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : data ? (
          <UserPointsList
            data={data?.user?.course_statistics?.filter(notEmpty) ?? []}
          />
        ) : (
          <div>No data!</div>
        )}
    </Container>
  )
}

export default withAdmin(UserPoints)
