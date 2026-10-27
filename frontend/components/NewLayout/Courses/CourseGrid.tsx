import React, { useEffect, useMemo, useRef, useState } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { sort } from "remeda"

import ClearIcon from "@mui/icons-material/Clear"
import {
  Checkbox,
  EnhancedButtonProps,
  FormControlLabel,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { styled, Theme } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import Button from "../Common/Button"
import ContentWrapper from "../Common/ContentWrapper"
import {
  allowedLanguages,
  courseStatuses,
  sortByDifficulty,
  sortByLanguage,
} from "./common"
import CourseCard, { CourseCardSkeleton } from "./CourseCard"
import {
  applyFilterState,
  DEFAULT_STATUSES,
  filterCourses,
  FilterUrlState,
  parseFilterQuery,
  resolveActiveTagIds,
} from "./courseFilters"
import BorderedSection from "/components/BorderedSection"
import { useCoursesData } from "/hooks/usePublicData"
import { useTranslator } from "/hooks/useTranslator"
import { NewCourseFields, TagCoreFields } from "/lib/api-types"
import CourseTranslations from "/translations/_new/courses"
import CommonTranslations from "/translations/common"
import { isDefinedAndNotEmpty } from "/util/guards"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import { CourseStatus } from "/graphql/generated"

/*  Coming in a later PR for better mobile view
  const Container = styled.div`
  display: grid;
  max-width: 600px;

  @media (min-width: 960px) {
    max-width: 960px;
  }

  @media (min-width: 1440px) {
    max-width: 1440px;
  }
`

const CardContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 100%;

  @media (min-width: 960px) {
    grid-template-columns: 50% 50%;
  }

  @media (min-width: 1440px) {
    grid-template-columns: 33% 33% 33%;
  }
` */

const Container = styled("div")`
  display: grid;
  width: 100%;
  margin: 0;
`

const CardsContainer = styled("ul")(
  ({ theme }) => `
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  ${theme.breakpoints.down("lg")} {
    grid-template-columns: 1fr;
    grid-gap: 2rem;
  }

  ${theme.breakpoints.down("sm")} {
    margin: 1.5rem 0;
  }
`,
)

const FiltersContainer = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.slightlyGray};
  padding-bottom: 0.5rem;
`,
)

const SearchBar = styled(TextField)`
  margin-bottom: 0.5rem 0;
`

const Filters = styled("div")(
  ({ theme }) => `
  margin: 1rem 0 1rem 0;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 10fr 6fr 4fr;
  grid-gap: 1rem;
  width: 100%;

  ${theme.breakpoints.down("md")} {
    grid-template-columns: 1fr;
    grid-auto-flow: row;
  }
`,
)

const Statuses = styled("div")`
  justify-self: end;
`

const ResetFiltersButton = styled(Button)<EnhancedButtonProps>`
  font-weight: bold;
  border-width: 0.15rem;
  max-height: 2.5rem;
`

const ListHeader = styled("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const SortSelect = styled(TextField)`
  min-width: 15rem;
`

const SEARCH_URL_DEBOUNCE_MS = 300

const DynamicTagSelectButtons = dynamic(() => import("./TagSelectButtons"), {
  loading: () => <Skeleton variant="rectangular" width="100%" height={96} />,
})

const DynamicTagSelectDropdowns = dynamic(
  () => import("./TagSelectDropdowns"),
  {
    loading: () => (
      <>
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={56} />
      </>
    ),
  },
)

const StyledBorderedSection = styled(BorderedSection)`
  margin: 1rem 0;
`

const joinWithCustomLastSeparator = (arr: Array<string>, separator = "or") => {
  if (arr.length === 0) {
    return ""
  }
  if (arr.length === 1) {
    return arr[0]
  }
  return `${arr.slice(0, -1).join(", ")} ${separator} ${arr.slice(-1)}`
}

interface SearchResultStatusProps {
  tags?: Array<TagCoreFields>
  statuses?: Array<CourseStatus>
  count: number
}

const SearchResultStatus = ({
  tags,
  statuses,
  count,
}: SearchResultStatusProps) => {
  const t = useTranslator(CourseTranslations)
  const statusResultStatus = joinWithCustomLastSeparator(
    (statuses ?? []).map(
      (s) =>
        "<strong>" +
        t(`result${s}${count !== 1 ? "Plural" : ""}`) +
        "</strong>",
    ),
    t("resultOr"),
  )
  const languageTagResultStatus = joinWithCustomLastSeparator(
    (tags ?? [])
      .filter((tag) => tag.types?.includes("language"))
      .map((tag) => "<strong>" + tag.name + "</strong>")
      .filter(isDefinedAndNotEmpty),
    t("resultOr"),
  )
  const difficultyTagResultStatus = joinWithCustomLastSeparator(
    (tags ?? [])
      .filter((tag) => tag.types?.includes("difficulty"))
      .sort(sortByDifficulty)
      .map((tag) => "<strong>" + tag.name + "</strong>")
      .filter(isDefinedAndNotEmpty),
    t("resultOr"),
  )
  const moduleTagResultStatus = joinWithCustomLastSeparator(
    (tags ?? [])
      .filter((tag) => tag.types?.includes("module"))
      .map((tag) => "<strong>" + tag.name + "</strong>")
      .filter(isDefinedAndNotEmpty),
    t("resultOr"),
  )

  let result = t("resultShowing", { count })
  if (statusResultStatus) {
    result += ` ${statusResultStatus}`
  }
  if (count !== 1) {
    result += " " + t("resultCoursePlural")
  } else {
    result += " " + t("resultCourse")
  }
  if (moduleTagResultStatus) {
    result += " " + t("resultModuleTags", { tags: moduleTagResultStatus })
  }
  if (difficultyTagResultStatus) {
    result +=
      " " + t("resultDifficultyTags", { tags: difficultyTagResultStatus })
  }
  if (languageTagResultStatus) {
    result += " " + t("resultLanguageTags", { tags: languageTagResultStatus })
  }

  return (
    <Typography
      variant="caption"
      role="status"
      dangerouslySetInnerHTML={{ __html: result }}
    />
  )
}

type CourseSort = "module" | "name"

const compareCoursesByName =
  (locale?: string) => (course1: NewCourseFields, course2: NewCourseFields) =>
    course1.name.localeCompare(course2.name, locale)

const compareCoursesByModule = (locale?: string) => {
  const byName = compareCoursesByName(locale)

  return (course1: NewCourseFields, course2: NewCourseFields) => {
    // courses without a module sort last
    if (course1.study_modules.length === 0) {
      return course2.study_modules.length === 0 ? byName(course1, course2) : 1
    }
    if (course2.study_modules.length === 0) {
      return -1
    }
    return (
      course1.study_modules[0].name.localeCompare(
        course2.study_modules[0].name,
        locale,
      ) || byName(course1, course2)
    )
  }
}

function CourseGrid() {
  const t = useTranslator(CommonTranslations, CourseTranslations)
  const router = useRouter()
  const { locale = "fi" } = router
  const language = mapNextLanguageToLocaleCode(locale)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const urlState = useMemo(
    () => parseFilterQuery(router.query, courseStatuses),
    [router.query],
  )
  const moduleless = router.query.moduleless === "true"

  const { isLoading: coursesLoading, data: coursesData } =
    useCoursesData(language)

  const [searchString, setSearchString] = useState(urlState.search)
  const lastWrittenSearch = useRef(urlState.search)
  const [courseSort, setCourseSort] = useState<CourseSort>("name")

  useEffect(() => {
    if (urlState.search !== lastWrittenSearch.current) {
      lastWrittenSearch.current = urlState.search
      setSearchString(urlState.search)
    }
  }, [urlState.search])

  const updateUrlState = useEventCallback((patch: Partial<FilterUrlState>) =>
    router.replace(
      {
        pathname: router.pathname,
        query: applyFilterState(router.query, patch),
      },
      undefined,
      { shallow: true },
    ),
  )

  useEffect(() => {
    if (searchString === lastWrittenSearch.current) {
      return
    }
    const timeout = setTimeout(() => {
      lastWrittenSearch.current = searchString
      updateUrlState({ search: searchString })
    }, SEARCH_URL_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [searchString, updateUrlState])

  const tags = useMemo(() => {
    const res: Record<string, Array<TagCoreFields>> = {}
    for (const curr of coursesData?.tags ?? []) {
      if (curr.hidden) {
        continue
      }
      curr?.types?.forEach((t) => {
        if (
          t === "language" &&
          curr.id &&
          !allowedLanguages.includes(curr.id)
        ) {
          return
        }
        if (!res[t]) {
          res[t] = []
        }
        res[t].push(curr)
      })
    }

    if (res["language"]) {
      res["language"].sort(sortByLanguage)
    }
    if (res["difficulty"]) {
      res["difficulty"].sort(sortByDifficulty)
    }

    return res
  }, [coursesData])

  const activeTagIds = useMemo(() => {
    const knownTagIds = new Set(
      Object.values(tags).flatMap((categoryTags) =>
        categoryTags.map((tag) => tag.id),
      ),
    )
    return resolveActiveTagIds({
      explicitTagIds:
        urlState.tagIds?.filter((id) => knownTagIds.has(id)) ?? null,
      defaultLanguageTagId: knownTagIds.has(locale) ? locale : undefined,
      search: searchString,
    })
  }, [tags, urlState.tagIds, locale, searchString])

  const activeTags = useMemo(
    () =>
      Object.values(tags)
        .flat()
        .filter(
          (tag, index, all) =>
            activeTagIds.includes(tag.id) &&
            all.findIndex((other) => other.id === tag.id) === index,
        ),
    [tags, activeTagIds],
  )

  const setActiveTags = useEventCallback(
    (
      value:
        | Array<TagCoreFields>
        | ((tags: Array<TagCoreFields>) => Array<TagCoreFields>),
    ) => {
      const newTags = typeof value === "function" ? value(activeTags) : value
      updateUrlState({ tagIds: newTags.map((tag) => tag.id) })
    },
  )

  const handleStatusChange = useEventCallback((status: CourseStatus) => () => {
    updateUrlState({
      statuses: urlState.statuses.includes(status)
        ? urlState.statuses.filter((s) => s !== status)
        : [...urlState.statuses, status],
    })
  })

  const handleResetButtonClick = () => {
    lastWrittenSearch.current = ""
    setSearchString("")
    updateUrlState({ search: "", tagIds: null, statuses: DEFAULT_STATUSES })
  }

  const handleSearchChange = useEventCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value),
  )

  const handleSortChange = useEventCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCourseSort(e.target.value as CourseSort),
  )

  const filteredCourses = useMemo(
    () =>
      filterCourses(coursesData?.courses ?? [], {
        search: searchString,
        activeTagIds,
        tagsByCategory: tags,
        statuses: urlState.statuses,
        moduleless,
      }),
    [
      coursesData,
      searchString,
      activeTagIds,
      tags,
      urlState.statuses,
      moduleless,
    ],
  )

  const sortedCourses = useMemo(
    () =>
      sort(
        filteredCourses,
        courseSort === "name"
          ? compareCoursesByName(locale)
          : compareCoursesByModule(locale),
      ),
    [filteredCourses, courseSort, locale],
  )

  const TagSelectComponent = useMemo(() => {
    if (isNarrow) {
      return DynamicTagSelectDropdowns
    }
    return DynamicTagSelectButtons
  }, [isNarrow])

  return (
    <ContentWrapper>
      <Container>
        <FiltersContainer>
          <SearchBar
            id="searchCourses"
            label={t("search")}
            value={searchString}
            autoComplete="off"
            variant="outlined"
            onChange={handleSearchChange}
          />
          <StyledBorderedSection title={t("filter")}>
            <Filters>
              <TagSelectComponent
                tags={tags}
                activeTags={activeTags}
                setActiveTags={setActiveTags}
                loading={coursesLoading}
              />
              <Statuses>
                {courseStatuses.map((status) => (
                  <FormControlLabel
                    label={t(status)}
                    key={status}
                    control={
                      <Checkbox
                        id={status}
                        checked={urlState.statuses.includes(status)}
                        onChange={handleStatusChange(status)}
                      />
                    }
                  />
                ))}
              </Statuses>
              <ResetFiltersButton
                id="resetFiltersButton"
                variant="text"
                onClick={handleResetButtonClick}
                startIcon={<ClearIcon />}
              >
                {t("reset")}
              </ResetFiltersButton>
            </Filters>
          </StyledBorderedSection>
        </FiltersContainer>
        {coursesLoading ? (
          <>
            <CardsContainer>
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
              <CourseCardSkeleton />
            </CardsContainer>
          </>
        ) : (
          <>
            <ListHeader>
              <SearchResultStatus
                tags={activeTags}
                statuses={urlState.statuses as Array<CourseStatus>}
                count={filteredCourses.length}
              />
              <SortSelect
                id="courseSort"
                select
                fullWidth={false}
                size="small"
                label={t("sortBy")}
                value={courseSort}
                onChange={handleSortChange}
              >
                <MenuItem value="name">{t("sortByName")}</MenuItem>
                <MenuItem value="module">{t("sortByModule")}</MenuItem>
              </SortSelect>
            </ListHeader>
            <CardsContainer>
              {sortedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
              {filteredCourses.length === 0 && (
                <li style={{ width: "100%" }}>no courses</li>
              )}
            </CardsContainer>
          </>
        )}
      </Container>
    </ContentWrapper>
  )
}

export default CourseGrid
