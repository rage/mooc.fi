import { useCallback, useEffect, useMemo, useState } from "react"

import { orderBy } from "lodash"
import router, { useRouter } from "next/router"

import {
  SortOrder,
  sortOrderOptions,
  UserCourseSummarySort,
  userCourseSummarySortOptions,
} from "../types"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCoreFieldsFragment } from "/graphql/generated"

interface UseSummaryCourseDataArgs {
  data?: Array<UserCourseSummaryCoreFieldsFragment> | null
  loading: boolean
  slug?: string
  sort?: string
  order?: string
}

function flipOrder(order: SortOrder) {
  return order === "asc" ? "desc" : "asc"
}

const defaultSort = "course_name"
const defaultOrder = "asc"

const toCourseList = (data: UserCourseSummaryCoreFieldsFragment) => ({
  id: data.course.id,
  slug: data.course.slug,
  name: data.course.name,
  tiers:
    data.tier_summaries?.map((t) => ({
      id: t.course.id,
      slug: t.course.slug,
      name: t.course.name,
    })) ?? undefined,
})

const useSummaryCourseData = ({
  data,
  loading,
  slug,
  sort: initialSort,
  order: initialOrder,
}: UseSummaryCourseDataArgs) => {
  const router = useRouter()
  const [selected, setSelected] = useState<string>(slug ?? "")
  const t = useTranslator(ProfileTranslations)

  const [sort, setSort] = useState<UserCourseSummarySort>(() => {
    if (
      userCourseSummarySortOptions.includes(
        initialSort as UserCourseSummarySort,
      )
    ) {
      return initialSort as UserCourseSummarySort
    }
    return defaultSort
  })
  const [order, setOrder] = useState<SortOrder>(() => {
    if (sortOrderOptions.includes(initialOrder as SortOrder)) {
      return initialOrder as SortOrder
    }
    return defaultOrder
  })

  const sortedCourses = useMemo(() => {
    if (!data) {
      return []
    }

    let sortedData = data

    switch (sort) {
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
          [flipOrder(order), order],
        )
        break
      case "completion_date":
        sortedData = orderBy(
          sortedData,
          [
            (entry) => entry.completion?.updated_at ?? "2999-01-01",
            "course.name",
          ],
          [flipOrder(order), order],
        )
        break
      default:
        sortedData = orderBy(sortedData, "course.name", order)
        break
    }

    return sortedData.map(toCourseList)
  }, [data, sort, order])

  useEffect(() => {
    if (sortedCourses?.length === 0) {
      return
    }
    if (selected && sortedCourses?.map((c) => c.slug).includes(selected)) {
      return
    }
    setSelected(sortedCourses?.[0]?.slug ?? "")
  }, [sortedCourses])

  const onSortOrderToggle = useCallback(() => {
    setOrder(flipOrder)
  }, [setOrder])

  const sortOptions = useMemo(
    () =>
      userCourseSummarySortOptions.map((o) => ({
        value: o,
        label: t(`courseSortOrder-${o}`),
      })),
    [router.locale],
  )

  const onCourseSortChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSort(event.target.value as UserCourseSummarySort)
    },
    [],
  )

  useEffect(() => {
    const queryParams = new URLSearchParams()
    if (sort && sort !== defaultSort) {
      queryParams.append("sort", sort)
    }
    if (order && order !== defaultOrder) {
      queryParams.append("order", order)
    }
    let path = router.asPath.split("summary")[0] + "summary"
    if (slug && slug === selected) {
      path += `/${slug}`
    }
    const href =
      path + (queryParams.toString().length > 0 ? "?" + queryParams : "")
    if (router.asPath && href !== router.asPath) {
      router.replace(href, undefined, { shallow: true })
    }
  }, [slug, selected, sort, order])

  return useMemo(
    () => ({
      courses: sortedCourses,
      loading,
      selected,
      setSelected,
      sort,
      order,
      onSortOrderToggle,
      onCourseSortChange,
      sortOptions,
    }),
    [sortedCourses, sort, order, selected],
  )
}

export default useSummaryCourseData
