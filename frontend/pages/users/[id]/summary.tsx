import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"

import { omit } from "lodash"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import BuildIcon from "@mui/icons-material/Build"
import { Button, Dialog, Paper, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import CollapseButton from "/components/Buttons/CollapseButton"
import Container from "/components/Container"
import CollapseContext, {
  ActionType,
  CollapsablePart,
  collapseReducer,
  createInitialState,
} from "/components/Dashboard/Users/Summary/CollapseContext"
import RawView from "/components/Dashboard/Users/Summary/RawView"
import UserPointsSummary from "/components/Dashboard/Users/Summary/UserPointsSummary"
import UserInfo from "/components/Dashboard/Users/UserInfo"
import ErrorMessage from "/components/ErrorMessage"
import FilterMenu, { SearchVariables } from "/components/FilterMenu"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CommonTranslations from "/translations/common"
import ProfileTranslations from "/translations/profile"
import UsersTranslations from "/translations/users"

import { UserSummaryDocument } from "/graphql/generated"

const StyledForm = styled("form")`
  display: flex;
  padding: 1rem;
`

const SearchContainer = styled(Paper)`
  margin-bottom: 0.5rem;
`

const ToolbarContainer = styled("div")`
  padding: 0.5rem 1rem 0.5rem 1rem;
  display: flex;
  width: 100%;
  flex: 1;
  justify-content: space-between;
`

const HideOverflow = styled("div")`
  overflow-y: hidden;
`

function UserSummaryView() {
  const t = useTranslator(
    UsersTranslations,
    ProfileTranslations,
    CommonTranslations,
  )
  const router = useRouter()
  const id = useQueryParameter("id")
  const { loading, error, data } = useQuery(UserSummaryDocument, {
    variables: {
      upstream_id: Number(id),
      includeNoPointsAwardedExercises: false,
      includeDeletedExercises: false,
    },
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

  const title = data?.user?.full_name ?? undefined

  const [state, dispatch] = useReducer(collapseReducer, {})
  const [searchVariables, setSearchVariables] = useState<
    Pick<SearchVariables, "search">
  >({
    search: "",
  })
  const [rawViewOpen, setRawViewOpen] = useState(false)
  const userSearchInput = useRef<HTMLInputElement>()

  useEffect(() => {
    dispatch({
      type: ActionType.INIT_STATE,
      state: createInitialState(data?.user?.user_course_summary ?? []),
    })
  }, [data])

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const userSearch = userSearchInput.current?.value

    if (userSearch) {
      router.push(`/users/search/${encodeURIComponent(userSearch)}`)
    }
  }, [])

  const contextValue = useMemo(() => ({ state, dispatch }), [state])

  const allCoursesClosed = useMemo(
    () => !Object.values(state).some((s) => s.open),
    [state],
  )

  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: allCoursesClosed ? ActionType.OPEN_ALL : ActionType.CLOSE_ALL,
        collapsable: CollapsablePart.COURSE,
      }),
    [allCoursesClosed],
  )

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
        <StyledForm onSubmit={onSubmit}>
          <TextField
            id="standard-search"
            label={t("searchUser")}
            type="search"
            margin="normal"
            autoComplete="off"
            size="small"
            inputRef={userSearchInput}
          />
        </StyledForm>
        <CollapseContext.Provider value={contextValue}>
          <UserInfo data={omit(data?.user, "user_course_summary")} />
          <SearchContainer>
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
            <ToolbarContainer>
              <Button
                variant="outlined"
                startIcon={<BuildIcon />}
                onClick={() => setRawViewOpen(!rawViewOpen)}
              >
                Raw view
              </Button>
              <CollapseButton
                onClick={onCollapseClick}
                open={!allCoursesClosed}
                label={allCoursesClosed ? t("showAll") : t("hideAll")}
                tooltip={t("allCoursesCollapseTooltip")}
              />
            </ToolbarContainer>
          </SearchContainer>
          <UserPointsSummary
            data={data?.user?.user_course_summary}
            search={searchVariables.search}
          />
        </CollapseContext.Provider>
        <Dialog
          fullWidth
          maxWidth="md"
          open={rawViewOpen}
          onClose={() => setRawViewOpen(false)}
        >
          <HideOverflow>
            <RawView value={JSON.stringify(data, undefined, 2)} />
          </HideOverflow>
        </Dialog>
      </Container>
    </>
  )
}

export default withAdmin(UserSummaryView)
