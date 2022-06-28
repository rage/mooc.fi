import React, { useEffect, useReducer, useState } from "react"

import { gql, useQuery } from "@apollo/client"
import { Paper } from "@mui/material"

import Container from "/components/Container"
import CollapseContext, {
  ActionType,
  collapseReducer,
  createInitialState,
} from "/components/Dashboard/Users/Summary/CollapseContext"
import UserPointsSummary from "/components/Dashboard/Users/Summary/UserPointsSummary"
import ErrorMessage from "/components/ErrorMessage"
import FilterMenu from "/components/FilterMenu"
import { CompletionsRegisteredFragment } from "/graphql/fragments/completionsRegistered"
import { UserCourseSummaryUserCourseProgressFragment } from "/graphql/fragments/userCourseProgress"
import { UserCourseSummaryUserCourseServiceProgressFragment } from "/graphql/fragments/userCourseServiceProgress"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import { UserSummary } from "/static/types/generated/UserSummary"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"

const UserSummaryQuery = gql`
  query UserSummary($upstream_id: Int) {
    user(upstream_id: $upstream_id) {
      id
      username
      user_course_summary {
        course {
          id
          name
          slug
          has_certificate
          photo {
            id
            uncompressed
          }
          exercises {
            id
            name
            custom_id
            course_id
            part
            section
            max_points
            deleted
          }
        }
        exercise_completions {
          id
          exercise_id
          created_at
          updated_at
          attempted
          completed
          timestamp
          n_points
          exercise_completion_required_actions {
            id
            value
          }
        }
        ...UserCourseSummaryUserCourseProgressFragment
        ...UserCourseSummaryUserCourseServiceProgressFragment
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
          student_number
          email
          ...CompletionsRegisteredFragment
        }
      }
    }
  }
  ${CompletionsRegisteredFragment}
  ${UserCourseSummaryUserCourseProgressFragment}
  ${UserCourseSummaryUserCourseServiceProgressFragment}
`

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: string[] | null
}

function UserSummaryView() {
  const id = useQueryParameter("id")
  const { loading, error, data } = useQuery<UserSummary>(UserSummaryQuery, {
    variables: { upstream_id: Number(id) },
  })

  useBreadcrumbs([
    {
      translation: "users",
    },
    {
      label: id,
    },
    {
      translation: "userSummary",
      href: `/users/${id}/summary`,
    },
  ])

  const [state, dispatch] = useReducer(collapseReducer, {})
  const [searchVariables, setSearchVariables] = useState<SearchVariables>({
    search: "",
  })
  useEffect(() => {
    dispatch({
      type: ActionType.INIT_STATE,
      state: createInitialState(
        data?.user?.user_course_summary?.filter(notEmpty),
      ),
    })
  }, [data])

  if (error) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  }

  return (
    <Container>
      <CollapseContext.Provider
        value={{
          state,
          dispatch,
        }}
      >
        <Paper style={{ marginBottom: "0.5rem" }}>
          <FilterMenu
            searchVariables={searchVariables}
            setSearchVariables={setSearchVariables}
            loading={loading}
            fields={{
              hidden: false,
              status: false,
              handler: false,
            }}
          />
        </Paper>
        <UserPointsSummary
          data={data?.user?.user_course_summary?.filter(notEmpty)}
          search={searchVariables.search}
        />
      </CollapseContext.Provider>
    </Container>
  )
}

export default withAdmin(UserSummaryView)
