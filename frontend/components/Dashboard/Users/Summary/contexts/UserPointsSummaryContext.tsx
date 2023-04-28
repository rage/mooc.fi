import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"

import { useRouter } from "next/router"

import { useEventCallback } from "@mui/material/utils"

import {
  defaultOrder,
  defaultSearch,
  defaultSort,
  userSummaryReducer,
  UserSummaryState,
} from "../state"
import {
  SortOrder,
  sortOrderOptions,
  UserCourseSummarySort,
  userCourseSummarySortOptions,
} from "../types"
import CollapseContext, {
  ActionType,
  collapseInitialState,
  collapseReducer,
  createCollapseState,
} from "./CollapseContext"
import { SearchVariables } from "/components/FilterMenu"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import ProfileTranslations from "/translations/profile"
import UsersTranslations from "/translations/users"

import {
  UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment,
  UserCourseSummaryCourseFieldsFragment,
  UserSummaryQuery,
  UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment,
} from "/graphql/generated"

interface UserPointsSummaryContext {
  data: Array<UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment> | null
  selectedData: UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment | null
  selected: UserCourseSummaryCourseFieldsFragment["slug"]
  sort: UserCourseSummarySort
  order: SortOrder
  sortOptions: Array<{ value: UserCourseSummarySort; label: string }>
  loading?: boolean
  searchVariables: SearchVariables
  hasNoData: boolean
  courseLoading?: boolean
}

interface UserPointsSummaryFunctionsContext {
  setSelected: (slug: UserCourseSummaryCourseFieldsFragment["slug"]) => void
  setSearchVariables: (
    variables:
      | SearchVariables
      | ((prevVariables: SearchVariables) => SearchVariables),
  ) => void
  onSortOrderToggle: () => void
  onCourseSortChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const UserPointsSummaryContextImpl = createContext<UserPointsSummaryContext>({
  data: [],
  selected: "",
  selectedData: null,
  sort: "course_name",
  order: "asc",
  sortOptions: [],
  searchVariables: { search: "" },
  hasNoData: false,
})

const UserPointsSummaryFunctionsContextImpl =
  createContext<UserPointsSummaryFunctionsContext>({
    setSelected: () => {
      /* */
    },
    setSearchVariables: () => {
      /* */
    },
    onSortOrderToggle: () => {
      /* */
    },
    onCourseSortChange: () => {
      /* */
    },
  })

export default UserPointsSummaryContextImpl
export { UserPointsSummaryFunctionsContextImpl as UserPointsSummaryFunctionsContext }

export function useUserPointsSummaryContext() {
  return useContext(UserPointsSummaryContextImpl)
}

export function useUserPointsSummaryFunctionsContext() {
  return useContext(UserPointsSummaryFunctionsContextImpl)
}

export function useUserPointsSummaryContextByCourseId(
  courseId: string,
  tierCourseId: string,
): UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseId(
  courseId: string,
): UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseId(
  courseId: string,
  tierCourseId?: string,
):
  | UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  | UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment
export function useUserPointsSummaryContextByCourseId(
  courseId: string,
  tierCourseId?: string,
):
  | UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
  | UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment {
  const { data } = useUserPointsSummaryContext()

  return useMemo(() => {
    const courseData = data?.find((course) => course.course?.id === courseId)

    if (!courseData) {
      throw new Error("course not found")
    }
    if (tierCourseId) {
      const tierCourseData = courseData.tier_summaries?.find(
        (t) => t.course?.id === tierCourseId,
      )
      if (!tierCourseData) {
        throw new Error("Tier course not found")
      }
      return tierCourseData as UserTierCourseSummaryCoreFieldsWithExerciseCompletionsFragment
    }
    return courseData ?? null
  }, [data, courseId, tierCourseId])
}

export const useSelectedData = () => {
  const { selectedData } = useUserPointsSummaryContext()

  return selectedData
}

type DataProps = {
  data?: UserSummaryQuery | null
  loading?: boolean
}

type Options = {
  initialSort: string
  initialOrder: string
  slug: string
}

type UserPointsSummaryContextProviderProps = {
  dataProps: DataProps
  options: Options
}

export const UserPointsSummaryContextProvider = ({
  dataProps,
  options,
  children,
}: PropsWithChildren<UserPointsSummaryContextProviderProps>) => {
  const router = useRouter()
  const t = useTranslator(
    UsersTranslations,
    ProfileTranslations,
    CommonTranslations,
  )
  const { initialSort, initialOrder, slug } = options
  const initialReducerValue: UserSummaryState = {
    data: null,
    originalData: null,
    loading: true,
    selected: slug ?? "",
    selectedData: null,
    searchVariables: defaultSearch,
    sort: userCourseSummarySortOptions.includes(
      initialSort as UserCourseSummarySort,
    )
      ? (initialSort as UserCourseSummarySort)
      : defaultSort,
    order: sortOrderOptions.includes(initialOrder as SortOrder)
      ? (initialOrder as SortOrder)
      : defaultOrder,
    courseLoading: false,
    hasNoData: false,
  }

  const [state, dispatch] = useReducer(userSummaryReducer, initialReducerValue)

  useEffect(() => {
    if (dataProps.data && !dataProps.loading) {
      dispatch({ type: "SET_DATA", payload: dataProps.data })
      collapseDispatch({
        type: ActionType.INIT_STATE,
        state: createCollapseState(
          dataProps.data?.user?.user_course_summary ?? [],
        ),
      })
    }
  }, [dataProps])

  useEffect(() => {
    if (state.originalData && state.data && state.loading) {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.originalData, state.data, state.loading])

  const setSelectedInternal = useEventCallback((slug: string) => {
    dispatch({ type: "SET_SELECTED", payload: slug })
  })

  const setSearchVariables = useEventCallback(
    (
      variables:
        | SearchVariables
        | ((prevVariables: SearchVariables) => SearchVariables),
    ) => {
      dispatch({
        type: "SET_SEARCH_VARIABLES",
        payload:
          typeof variables === "function"
            ? variables(state.searchVariables)
            : variables,
      })
    },
  )
  const setSort = useEventCallback((sort: UserCourseSummarySort) => {
    dispatch({ type: "SET_SORT", payload: sort })
  })
  const onSortOrderToggle = useEventCallback(() => {
    dispatch({ type: "TOGGLE_ORDER" })
  })

  const setSelected = useCallback((slug: string) => {
    setTimeout(() => setSelectedInternal(slug))
  }, [])

  const sortOptions = useMemo(
    () =>
      userCourseSummarySortOptions.map((o) => ({
        value: o,
        label: t(`courseSortOrder-${o}`),
      })),
    [router.locale],
  )

  const onCourseSortChange = useEventCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSort(event.target.value as UserCourseSummarySort)
    },
  )

  const [collapseState, collapseDispatch] = useReducer(
    collapseReducer,
    collapseInitialState,
  )

  useEffect(() => {
    const queryParams = new URLSearchParams()
    if (state.sort && state.sort !== defaultSort) {
      queryParams.append("sort", state.sort)
    }
    if (state.order && state.order !== defaultOrder) {
      queryParams.append("order", state.order)
    }
    let path = router.asPath.split("summary")[0] + "summary"
    if (slug && slug === state.selected) {
      path += `/${slug}`
    }
    const href =
      path + (queryParams.toString().length > 0 ? "?" + queryParams : "")
    if (router.asPath && href !== router.asPath) {
      router.replace(href, undefined, { shallow: true })
    }
  }, [slug, state.selected, state.sort, state.order])

  const contextValue = useMemo(
    () => ({
      ...state,
      sortOptions,
    }),
    [state, sortOptions],
  )

  const fnValue = useMemo(
    () => ({
      dispatch,
      setSelected,
      setSearchVariables,
      onCourseSortChange,
      onSortOrderToggle,
    }),
    [setSelected],
  )

  const collapseContextValue = useMemo(
    () => ({ state: collapseState, dispatch: collapseDispatch }),
    [collapseState],
  )

  return (
    <UserPointsSummaryFunctionsContextImpl.Provider value={fnValue}>
      <UserPointsSummaryContextImpl.Provider value={contextValue}>
        <CollapseContext.Provider value={collapseContextValue}>
          {children}
        </CollapseContext.Provider>
      </UserPointsSummaryContextImpl.Provider>
    </UserPointsSummaryFunctionsContextImpl.Provider>
  )
}
