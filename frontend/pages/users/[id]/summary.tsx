import React, { useEffect, useMemo, useReducer, useState } from "react"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { Paper, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

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
import { useSearch } from "/hooks/useSearch"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import UsersTranslations from "/translations/users"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import {
  EditorCoursesQueryVariables,
  UserSummaryDocument,
} from "/graphql/generated"

const StyledForm = styled("form")`
  display: flex;
  padding: 1rem;
`

function UserSummaryView() {
  const t = useTranslator(UsersTranslations)
  const router = useRouter()
  const id = useQueryParameter("id")
  const { loading, error, data } = useQuery(UserSummaryDocument, {
    variables: {
      upstream_id: Number(id),
      includeNoPointsAwardedExercises: false,
      includeDeletedExercises: false,
    },
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

  const title = useSubtitle(data?.user?.full_name ?? undefined)

  const [state, dispatch] = useReducer(collapseReducer, {})
  const [searchVariables, setSearchVariables] =
    useState<EditorCoursesQueryVariables>({
      search: "",
    })
  const { search: userSearch, setSearch: setUserSearch } = useSearch()

  useEffect(() => {
    dispatch({
      type: ActionType.INIT_STATE,
      state: createInitialState(
        data?.user?.user_course_summary?.filter(notEmpty),
      ),
    })
  }, [data])

  const handleUserSearchSubmit = () => {
    if (userSearch !== "") {
      router.push(`/users/search/${encodeURIComponent(userSearch)}`)
    }
  }

  const onUserSearchChange = (event: any) => {
    setUserSearch(event.target.value as string)
  }

  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  if (error) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  }

  return (
    <>
      <NextSeo title={title} />
      <Container>
        <CollapseContext.Provider value={contextValue}>
          <Paper style={{ marginBottom: "0.5rem" }}>
            <StyledForm
              onSubmit={async (event: any) => {
                event.preventDefault()
                handleUserSearchSubmit()
              }}
            >
              <TextField
                id="standard-search"
                label={t("searchUser")}
                type="search"
                margin="normal"
                autoComplete="off"
                value={userSearch}
                onChange={onUserSearchChange}
              />
            </StyledForm>
            <FilterMenu
              searchVariables={searchVariables}
              setSearchVariables={setSearchVariables}
              loading={loading}
              label={t("searchInCourses")}
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
    </>
  )
}

export default withAdmin(UserSummaryView)
