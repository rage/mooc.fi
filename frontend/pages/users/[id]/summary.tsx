import React, { useEffect, useMemo, useReducer, useState } from "react"

import { useQuery } from "@apollo/client"
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
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"

import { CourseStatus, UserSummaryDocument } from "/graphql/generated"

interface SearchVariables {
  search?: string
  hidden?: boolean | null
  handledBy?: string | null
  status?: CourseStatus[] | null
}

function UserSummaryView() {
  const id = useQueryParameter("id")
  const { loading, error, data } = useQuery(UserSummaryDocument, {
    variables: { upstream_id: Number(id) },
    ssr: false,
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

  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  if (error) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  }

  return (
    <Container>
      <CollapseContext.Provider value={contextValue}>
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
