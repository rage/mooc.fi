import { Reducer } from "react"

import { orderBy, sortBy } from "lodash"

import { SearchVariables } from "/components/FilterMenu"

import {
  UserCourseSummaryCoreFieldsFragment,
  UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment,
  UserSummaryQuery,
} from "/graphql/generated"

export const userCourseSummarySortOptions = [
  "course_name",
  "activity_date",
  "completion_date",
] as const

export type UserCourseSummarySort =
  (typeof userCourseSummarySortOptions)[number]

export const sortOrderOptions = ["asc", "desc"] as const

export type SortOrder = (typeof sortOrderOptions)[number]

export type UserSummaryState = {
  data: Array<UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment> | null
  originalData: UserSummaryQuery | null
  selected: string
  selectedData: UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment | null
  searchVariables: SearchVariables
  sort: UserCourseSummarySort
  order: SortOrder
  hasNoData: boolean
  loading: boolean
  courseLoading: boolean
}

function mapExerciseCompletionsToExercise(
  data: UserCourseSummaryCoreFieldsFragment,
): UserCourseSummaryCoreFieldsWithExerciseCompletionsFragment {
  return {
    ...data,
    course: {
      ...data?.course,
      exercises: sortBy(
        (data?.course?.exercises ?? []).map((exercise) => ({
          ...exercise,
          exercise_completions: (data?.exercise_completions ?? []).filter(
            (ec) => ec?.exercise_id === exercise.id,
          ),
        })),
        ["part", "section", "name"],
      ),
    },
    tier_summaries:
      data?.tier_summaries?.map((tierEntry) => ({
        ...tierEntry,
        course: {
          ...tierEntry?.course,
          exercises: sortBy(
            (tierEntry?.course?.exercises ?? []).map((exercise) => ({
              ...exercise,
              exercise_completions: (
                tierEntry?.exercise_completions ?? []
              ).filter((ec) => ec?.exercise_id === exercise.id),
            })),
            ["part", "section", "name"],
          ),
        },
      })) ?? null,
  }
}

function flipOrder(order: SortOrder) {
  return order === "asc" ? "desc" : "asc"
}

const updateSortedData = (state: UserSummaryState) => {
  const { originalData: data } = state
  const mappedData = data?.user?.user_course_summary?.map(
    mapExerciseCompletionsToExercise,
  )
  if (!mappedData) {
    return state
  }

  let sortedData = mappedData

  switch (state.sort) {
    case "activity_date":
      sortedData = orderBy(
        sortedData,
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
        [flipOrder(state.order), state.order],
      )
      break
    case "completion_date":
      sortedData = orderBy(
        sortedData,
        [
          (entry) => entry.completion?.updated_at ?? "2999-01-01",
          "course.name",
        ],
        [flipOrder(state.order), state.order],
      )
      break
    default:
      sortedData = orderBy(sortedData, "course.name", state.order)
      break
  }

  if (state.searchVariables.search) {
    sortedData = sortedData.filter((entry) =>
      entry?.course?.name
        .trim()
        .toLocaleLowerCase()
        .includes(state.searchVariables.search?.toLocaleLowerCase() ?? ""),
    )
  }

  return {
    ...state,
    data: sortedData, //.map(toCourseList)
  }
}

const selectDefault = (state: UserSummaryState): UserSummaryState => {
  const {
    data,
    selected,
    selectedData,
    originalData,
    searchVariables: { search },
  } = state
  const slugs = data?.map((d) => d.course?.slug) ?? []
  const originalSlugs =
    originalData?.user?.user_course_summary?.map((d) => d.course?.slug) ?? []

  if (!data) {
    return {
      ...state,
      selected: "",
      selectedData: null,
    }
  }
  if (selected && !slugs.find((slug) => slug === selected)) {
    // we have filtered the selected course from the list, but it the slug is valid
    // so we keep the selected course even if it does not show in the list
    if (search && originalSlugs.find((slug) => slug === selected)) {
      return state
    }
    return {
      ...state,
      selected: "",
      selectedData: null,
    }
  }
  if (selected && selected !== selectedData?.course?.slug) {
    return {
      ...state,
      selectedData: data.find((d) => d.course?.slug === selected) ?? null,
    }
  }
  if (!selected) {
    return {
      ...state,
      selected: data[0]?.course?.slug ?? "",
      selectedData: data[0] ?? null,
    }
  }

  return state
}

export const defaultSort = "course_name"
export const defaultOrder = "asc"
export const defaultSearch = { search: "" }

export type UserSummaryAction =
  | { type: "SET_SELECTED"; payload: string }
  | { type: "SET_SEARCH_VARIABLES"; payload: SearchVariables }
  | { type: "SET_SORT"; payload: UserCourseSummarySort }
  | { type: "TOGGLE_ORDER" }
  | { type: "RESET_SORT_AND_ORDER" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_COURSE_LOADING"; payload: boolean }
  | { type: "SET_DATA"; payload: UserSummaryQuery | null }

export const userSummaryReducer: Reducer<
  UserSummaryState,
  UserSummaryAction
> = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED":
      return selectDefault({
        ...state,
        selected: action.payload,
      })
    case "SET_SEARCH_VARIABLES":
      return selectDefault(
        updateSortedData({
          ...state,
          searchVariables: action.payload,
        }),
      )
    case "SET_SORT":
      return updateSortedData({
        ...state,
        sort: action.payload,
      })
    case "TOGGLE_ORDER":
      return updateSortedData({
        ...state,
        order: flipOrder(state.order),
      })
    case "RESET_SORT_AND_ORDER":
      return updateSortedData({
        ...state,
        sort: defaultSort,
        order: defaultOrder,
      })
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_COURSE_LOADING":
      return {
        ...state,
        courseLoading: action.payload,
      }
    case "SET_DATA":
      return selectDefault(
        updateSortedData({
          ...state,
          originalData: action.payload,
          hasNoData:
            Boolean(action.payload?.user?.user_course_summary) &&
            !action?.payload?.user?.user_course_summary?.length,
        }),
      )
    default:
      return state
  }
}
