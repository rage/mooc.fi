import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react"

import { omit, orderBy } from "lodash"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
// import OrderIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-down-wide-short.svg?icon"
// import ReverseOrderIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-up-short-wide.svg?icon"
import BuildIcon from "@mui/icons-material/Build"
import { Button, Dialog, Paper, TextField, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import CollapseButton from "/components/Buttons/CollapseButton"
import Container from "/components/Container"
import CollapseContext, {
  ActionType,
  CollapsablePart,
  collapseReducer,
  createCollapseState,
  initialState,
} from "/components/Dashboard/Users/Summary/CollapseContext"
import CourseSelectDropdown from "/components/Dashboard/Users/Summary/CourseSelectDropdown"
import useSortOrder from "/components/Dashboard/Users/Summary/hooks/useSortOrder"
import RawView from "/components/Dashboard/Users/Summary/RawView"
import {
  SortOrder,
  sortOrderOptions,
  UserCourseSummarySort,
  userCourseSummarySortOptions,
} from "/components/Dashboard/Users/Summary/types"
import UserPointsSummary from "/components/Dashboard/Users/Summary/UserPointsSummary"
import UserPointsSummaryContext from "/components/Dashboard/Users/Summary/UserPointsSummaryContext"
import UserPointsSummarySelectedCourseContext from "/components/Dashboard/Users/Summary/UserPointsSummarySelectedCourseContext"
import UserInfo from "/components/Dashboard/Users/UserInfo"
import ErrorMessage from "/components/ErrorMessage"
import FilterMenu from "/components/FilterMenu"
import { Breadcrumb } from "/contexts/BreadcrumbContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useSubtitle from "/hooks/useSubtitle"
import withAdmin from "/lib/with-admin"
import CommonTranslations from "/translations/common"
import ProfileTranslations from "/translations/profile"
import UsersTranslations from "/translations/users"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import {
  EditorCoursesQueryVariables,
  UserCourseSummaryCoreFieldsFragment,
  UserCourseSummaryCourseFieldsFragment,
  UserSummaryDocument,
} from "/graphql/generated"

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
  gap: 0.5rem;
  flex: 1;
  justify-content: space-between;
`

const HideOverflow = styled("div")`
  overflow-y: hidden;
`

const RightToolbarContainer = styled("div")`
  display: flex;
  gap: 1rem;
`

const defaultSort = "course_name"
const defaultOrder = "asc"

function flipOrder(order: SortOrder) {
  return order === "asc" ? "desc" : "asc"
}

function UserSummaryView() {
  const isNarrow = useMediaQuery("(max-width: 800px)")

  const t = useTranslator(
    UsersTranslations,
    ProfileTranslations,
    CommonTranslations,
  )
  const router = useRouter()
  const id = useQueryParameter("id")
  const slug = useQueryParameter("slug", false)
  const _sort = useQueryParameter("sort", false)
  const _order = useQueryParameter("order", false)
  const { loading, error, data } = useQuery(UserSummaryDocument, {
    variables: {
      upstream_id: Number(id),
      includeNoPointsAwardedExercises: false,
      includeDeletedExercises: false,
    },
    ssr: false,
  })

  const breadcrumbs = useMemo(() => {
    const crumbs: Array<Breadcrumb> = [
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
    ]

    if (slug) {
      const entry = data?.user?.user_course_summary?.find(
        ({ course }) => course.slug === slug,
      )
      const isInvalid = !loading && data && !entry
      if (!isInvalid) {
        crumbs.push({
          label: entry?.course.name,
          href: `/users/${id}/summary/${slug}`,
        })
      }
    }
    return crumbs
  }, [data, slug])

  useBreadcrumbs(breadcrumbs)

  const title = useSubtitle(data?.user?.full_name ?? undefined)

  const [state, dispatch] = useReducer(collapseReducer, initialState)
  const [searchVariables, setSearchVariables] =
    useState<EditorCoursesQueryVariables>({
      search: "",
    })
  const [rawViewOpen, setRawViewOpen] = useState(false)
  const [selected, setSelected] = useState<
    UserCourseSummaryCourseFieldsFragment["slug"]
  >(slug ?? "")

  const userSearchInput = useRef<HTMLInputElement>()

  useEffect(() => {
    if (loading) {
      return
    }
    dispatch({
      type: ActionType.INIT_STATE,
      state: createCollapseState(data?.user?.user_course_summary ?? []),
    })
  }, [data, loading])

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const userSearch = userSearchInput.current?.value

    if (userSearch) {
      router.push(`/users/search/${encodeURIComponent(userSearch)}`)
    }
  }, [])

  const collapseContextValue = useMemo(() => ({ state, dispatch }), [state])

  const allCoursesClosed = useMemo(
    () => !Object.values(state.courses).some((s) => s.open),
    [state],
  )

  // @ts-ignore: not used
  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: allCoursesClosed ? ActionType.OPEN_ALL : ActionType.CLOSE_ALL,
        collapsable: CollapsablePart.COURSE,
      }),
    [allCoursesClosed],
  )

  const selectedCourseContextValue = useMemo(
    () => ({
      selected,
      setSelected,
    }),
    [selected, setSelected],
  )

  const userPointsSummaryContextValue = useSortOrder({
    initialData: data?.user?.user_course_summary,
    initialSort: _sort,
    initialOrder: _order,
    search: searchVariables.search,
  })

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
        <CollapseContext.Provider value={collapseContextValue}>
          <UserPointsSummaryContext.Provider
            value={userPointsSummaryContextValue}
          >
            <UserPointsSummarySelectedCourseContext.Provider
              value={selectedCourseContextValue}
            >
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
                  {isNarrow && (
                    <CourseSelectDropdown
                      selected={selected}
                      loading={loading}
                    />
                  )}
                  <RightToolbarContainer>
                    {/*<TextField
                  select
                  variant="outlined"
                  value={sort}
                  label={t("courseSortOrder")}
                  onChange={onCourseSortChange}
                  fullWidth
                >
                  {sortOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                  </TextField>
                <IconButton
                  onClick={onSortOrderToggle}
                  title={t("toggleOrder")}
                >
                  {order === "desc" ? <ReverseOrderIcon /> : <OrderIcon />}
                  </IconButton>
                    <CollapseButton
                      onClick={onCollapseClick}
                      open={!allCoursesClosed}
                      tooltip={t("allCoursesCollapseTooltip")}
                  />*/}
                  </RightToolbarContainer>
                </ToolbarContainer>
              </SearchContainer>
              <UserPointsSummary loading={loading || state.loading} />
            </UserPointsSummarySelectedCourseContext.Provider>
          </UserPointsSummaryContext.Provider>
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
