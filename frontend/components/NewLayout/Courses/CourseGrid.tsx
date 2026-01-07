import React, { useCallback, useEffect, useMemo, useState } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { difference, sort } from "remeda"

import ClearIcon from "@mui/icons-material/Clear"
import {
  Checkbox,
  EnhancedButtonProps,
  FormControlLabel,
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
import BorderedSection from "/components/BorderedSection"
import { useCoursesData } from "/hooks/usePublicData"
import { useQueryParameter } from "/hooks/useQueryParameter"
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
      dangerouslySetInnerHTML={{ __html: result }}
    />
  )
}

const courseHasTag = (course: NewCourseFields | null, tag: TagCoreFields) => {
  if (!course) {
    return false
  }
  return course.tags.some((courseTag) => courseTag.name === tag.name)
}

const compareCourses = (course1: NewCourseFields, course2: NewCourseFields) => {
  if (course1.study_modules.length == 0) {
    return 1
  } else if (course2.study_modules.length == 0) {
    return -1
  } else if (course1.study_modules[0].name < course2.study_modules[0].name) {
    return -1
  } else if (course1.study_modules[0].name >= course2.study_modules[0].name) {
    return 1
  } else {
    return 0
  }
}

function areEqual<T>(a: Array<T>, b: Array<T>) {
  return a.length === b.length && !difference(a, b).length
}

function CourseGrid() {
  const t = useTranslator(CommonTranslations)
  const router = useRouter()
  const { locale = "fi" } = router
  const language = mapNextLanguageToLocaleCode(locale)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))
  const initialActiveTags = useQueryParameter("tag", {
    enforce: false,
    array: true,
  })
  const initialStatuses = useQueryParameter("status", {
    enforce: false,
    array: true,
  })

  const typedInitialStatuses: CourseStatus[] = Array.isArray(initialStatuses)
    ? initialStatuses.filter((s): s is CourseStatus => {
        const statusValues: string[] = Object.values(CourseStatus)
        return statusValues.includes(s)
      })
    : []
  const moduleless = useQueryParameter("moduleless", {
    enforce: false,
    array: false,
  })

  const { isLoading: coursesLoading, data: coursesData } =
    useCoursesData(language)

  const tagsData = coursesData

  const tagsLoading = coursesLoading

  React.useEffect(() => {
    if (tagsData?.tags) {
      if (initialActiveTags) {
        setActiveTags(
          tagsData.tags.filter((tag) => initialActiveTags.includes(tag.id)) ??
            [],
        )
      } else {
        const defaultLanguageTag = tagsData.tags.find(
          (tag) => tag.id === locale && tag.types?.includes("language"),
        )
        if (defaultLanguageTag) {
          setActiveTags([defaultLanguageTag])
        }
      }
    }
  }, [tagsData, initialActiveTags, locale])

  let initialFilteredStatuses = [CourseStatus.Active, CourseStatus.Upcoming]
  if (typedInitialStatuses.length > 0) {
    initialFilteredStatuses = typedInitialStatuses
  }

  const [searchString, setSearchString] = useState<string>("")
  const [activeTags, setActiveTags] = useState<Array<TagCoreFields>>([])
  const [filteredStatuses, setFilteredStatuses] = useState<CourseStatus[]>(
    initialFilteredStatuses,
  )

  const tags = useMemo(() => {
    const res: Record<string, Array<TagCoreFields>> = {}
    for (const curr of tagsData?.tags ?? []) {
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
  }, [tagsData])

  const handleStatusChange = useCallback(
    (status: CourseStatus) => () => {
      setFilteredStatuses((oldStatuses) => {
        if (oldStatuses.includes(status)) {
          return oldStatuses.filter((s) => s !== status)
        }
        return [...oldStatuses, status]
      })
    },
    [filteredStatuses],
  )

  const handleResetButtonClick = () => {
    setSearchString("")
    setActiveTags([])
    setFilteredStatuses([CourseStatus.Active, CourseStatus.Upcoming])
  }

  const handleSearchChange = useEventCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value),
  )

  const handleSelectAllTags = useCallback(
    () => setActiveTags([...(tagsData?.tags ?? [])]),
    [tagsData],
  )

  const filteredCourses = useMemo(
    () =>
      (coursesData?.courses ?? []).filter((course) => {
        if (
          course.hidden ||
          !course.course_translations ||
          course.course_translations.length === 0
        ) {
          return false
        }
        if (moduleless === "true" && course.study_modules.length > 0) {
          return false
        }
        if (
          !course.name
            .toLocaleLowerCase(locale)
            .includes(searchString.toLocaleLowerCase(locale)) &&
          !course.description
            ?.toLocaleLowerCase(locale)
            .includes(searchString.toLocaleLowerCase(locale)) &&
          !moduleless
        ) {
          return false
        }
        if (
          activeTags.length > 0 &&
          !activeTags.every((tag) => courseHasTag(course, tag))
        ) {
          return false
        }
        if (
          filteredStatuses.length > 0 &&
          course.status &&
          !filteredStatuses.includes(course.status as CourseStatus)
        ) {
          return false
        }
        return true
      }),
    [coursesData, searchString, activeTags, filteredStatuses],
  )

  useEffect(() => {
    if (tagsLoading) {
      return
    }
    if (
      areEqual(
        activeTags.map((t) => t.id),
        initialActiveTags,
      ) &&
      areEqual(filteredStatuses, typedInitialStatuses)
    ) {
      return
    }

    const params = new URLSearchParams()
    if (filteredStatuses.length > 0) {
      for (const status of filteredStatuses) {
        params.append("status", status)
      }
      if (
        filteredStatuses.length === 2 &&
        filteredStatuses.includes(CourseStatus.Active) &&
        filteredStatuses.includes(CourseStatus.Upcoming)
      ) {
        params.delete("status")
      }
    }
    if (activeTags.length > 0) {
      for (const tag of activeTags) {
        params.append("tag", tag.id)
      }
    }
    router.replace({ query: params.toString() }, undefined, { shallow: true })
  }, [tagsLoading, activeTags, filteredStatuses])

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
                selectAllTags={handleSelectAllTags}
                loading={tagsLoading}
              />
              <Statuses>
                {courseStatuses.map((status) => (
                  <FormControlLabel
                    label={t(status)}
                    key={status}
                    control={
                      <Checkbox
                        id={status}
                        checked={filteredStatuses.includes(status)}
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
            <SearchResultStatus
              tags={activeTags}
              statuses={filteredStatuses}
              count={filteredCourses.length}
            />
            <CardsContainer>
              {sort(filteredCourses, compareCourses).map((course) => (
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
