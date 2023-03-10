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
  const slug = useQueryParameter("slug", false)

  const t = useTranslator(
    UsersTranslations,
    ProfileTranslations,
    CommonTranslations,
  )
  const router = useRouter()
  const id = useQueryParameter("id")
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

  const [state, dispatch] = useReducer(collapseReducer, initialState)
  const [searchVariables, setSearchVariables] =
    useState<EditorCoursesQueryVariables>({
      search: "",
    })
  const [rawViewOpen, setRawViewOpen] = useState(false)
  const [sort, setSort] = useState<UserCourseSummarySort>(() => {
    if (userCourseSummarySortOptions.includes(_sort as UserCourseSummarySort)) {
      return _sort as UserCourseSummarySort
    }
    return defaultSort
  })
  const [order, setOrder] = useState<SortOrder>(() => {
    if (sortOrderOptions.includes(_order as SortOrder)) {
      return _order as SortOrder
    }
    return defaultOrder
  })
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

  const onCollapseClick = useCallback(
    () =>
      dispatch({
        type: allCoursesClosed ? ActionType.OPEN_ALL : ActionType.CLOSE_ALL,
        collapsable: CollapsablePart.COURSE,
      }),
    [allCoursesClosed],
  )

  // @ts-ignore: not used
  const onCourseSortChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSort(event.target.value as UserCourseSummarySort)
    },
    [],
  )

  // @ts-ignore: not used
  const onSortOrderToggle = useCallback(() => {
    setOrder((v) => flipOrder(v))
  }, [setOrder])

  // @ts-ignore: not used
  const sortOptions = useMemo(
    () =>
      userCourseSummarySortOptions.map((o) => ({
        value: o,
        label: t(`courseSortOrder-${o}`),
      })),
    [router.locale],
  )

  const selectedCourseContextValue = useMemo(
    () => ({
      selected,
      setSelected,
    }),
    [selected, setSelected],
  )

  const filteredData = useMemo(() => {
    if (!data) {
      return []
    }

    const { search } = searchVariables

    let sortedData: Array<UserCourseSummaryCoreFieldsFragment>

    switch (sort) {
      case "activity_date":
        sortedData = orderBy(
          data.user?.user_course_summary,
          [
            (entry) => {
              const combinedExerciseCompletions = (
                entry.exercise_completions ?? []
              ).concat(
                (entry.tier_summaries ?? []).flatMap(
                  (t) => t.exercise_completions ?? [],
                ),
              )
              return (
                orderBy(combinedExerciseCompletions, "created_at")?.pop()
                  ?.updated_at ?? "2999-01-01"
              )
            },
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      case "completion_date":
        sortedData = orderBy(
          data.user?.user_course_summary,
          [
            (entry) => entry.completion?.updated_at ?? "2999-01-01",
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      default:
        sortedData = orderBy(
          data.user?.user_course_summary,
          "course.name",
          order,
        )
        break
    }

    if (!search) {
      return sortedData
    }

    const searchData = sortedData.filter((entry) =>
      entry?.course?.name
        .trim()
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
    )

    return searchData
  }, [searchVariables.search, order, sort, data])

  useEffect(() => {
    const queryParams = new URLSearchParams()
    if (sort && sort !== defaultSort) {
      queryParams.append("sort", sort)
    }
    if (order && order !== defaultOrder) {
      queryParams.append("order", order)
    }
    let basePath = router.asPath.split("?")[0]
    if (selected && basePath.split("summary")[1]) {
      basePath = basePath.split("summary")[0] + "summary/" + selected
    }
    const href =
      basePath + (queryParams.toString().length > 0 ? "?" + queryParams : "")
    router.replace(href, undefined, { shallow: true })
  }, [sort, order, selected])

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
          <UserPointsSummaryContext.Provider value={filteredData}>
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
                  </IconButton>*/}
                    <CollapseButton
                      onClick={onCollapseClick}
                      open={!allCoursesClosed}
                      label={allCoursesClosed ? t("showAll") : t("hideAll")}
                      tooltip={t("allCoursesCollapseTooltip")}
                    />
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
