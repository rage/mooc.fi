import { useMemo, useState } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import ClearIcon from "@mui/icons-material/Clear"
import {
  Button,
  ButtonProps,
  Checkbox,
  FormControlLabel,
  Skeleton,
  TextField,
  useMediaQuery,
} from "@mui/material"
import { styled, Theme } from "@mui/material/styles"

import CourseCard, { CourseCardSkeleton } from "./CourseCard"
import BorderedSection from "/components/BorderedSection"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import {
  CourseCatalogueTagsDocument,
  CourseFieldsFragment,
  CoursesDocument,
  CourseStatus,
  TagCoreFieldsFragment,
} from "/graphql/generated"

const allowedLanguages = ["en", "fi", "se", "other_language"]

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

const Container = styled("div")(
  ({ theme }) => `
  display: grid;
  width: 90%;
  margin: 0 auto;
  max-width: 1536px;
  padding: 1rem;

  ${theme.breakpoints.down("sm")} {
    width: 98%;
  }
`,
)

const CardContainer = styled("ul")(
  ({ theme }) => `
  list-style: none;
  padding: 0;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;
  margin-top: 0;
  justify-self: center;

  ${theme.breakpoints.down("lg")} {
    grid-template-columns: 1fr;
  }
`,
)

const FiltersContainer = styled("div")`
  background: #f5f6f7;
  padding-bottom: 1.5rem;
`

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

const ResetFiltersButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "variant",
})<ButtonProps & { variant: string }>`
  border-radius: 1rem;
  font-weight: bold;
  border-width: 0.15rem;
  max-height: 2.5rem;
  color: ${({ variant }) => (variant === "contained" ? "#F5F6F7" : "#378170")};
  background-color: ${({ variant }) =>
    variant === "contained" ? "#378170" : "#F5F6F7"};

  &:hover {
    border-width: 0.15rem;
    background-color: ${({ variant }) =>
      variant === "contained" ? "#378170" : "#F5F6F7"};
  }
`

const DynamicTagSelectButtons = dynamic(() => import("./TagSelectButtons"), {
  loading: () => (
    <>
      <Skeleton variant="rectangular" width="100%" height={50} />
      <Skeleton variant="rectangular" width="100%" height={50} />
      <Skeleton variant="rectangular" width="100%" height={50} />
    </>
  ),
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

const courseHasTag = (
  course: CourseFieldsFragment | null,
  tag: TagCoreFieldsFragment,
) => {
  if (!course) {
    return false
  }
  return course.tags.some((courseTag) => courseTag.name === tag.name)
}

const compareCourses = (
  course1: CourseFieldsFragment,
  course2: CourseFieldsFragment,
) => {
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

function CourseGrid() {
  const t = useTranslator(CommonTranslations)
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"))

  const { loading: coursesLoading, data: coursesData } = useQuery(
    CoursesDocument,
    {
      variables: { language },
      ssr: false,
    },
  )

  // @ts-ignore: tagsLoading not used for now
  const { loading: tagsLoading, data: tagsData } = useQuery(
    CourseCatalogueTagsDocument,
    {
      variables: { language },
      ssr: false,
    },
  )
  const [searchString, setSearchString] = useState<string>("")
  const [activeTags, setActiveTags] = useState<Array<TagCoreFieldsFragment>>([])
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([
    CourseStatus.Active,
    CourseStatus.Upcoming,
  ])

  const tags = useMemo(
    () =>
      (tagsData?.tags ?? []).reduce((acc, curr) => {
        curr?.types?.forEach((t) => {
          if (
            t === "language" &&
            curr.id &&
            !allowedLanguages.includes(curr.id)
          ) {
            return acc
          }
          acc[t] = (acc[t] ?? []).concat(curr)
        })
        return acc
      }, {} as Record<string, Array<TagCoreFieldsFragment>>),
    [tagsData],
  )
  // TODO: set tags on what tags are found from courses in db? or just do a hard-coded list of tags?

  const handleStatusChange = (status: string) => {
    filteredStatuses.includes(status)
      ? setFilteredStatuses(filteredStatuses.filter((s) => s !== status))
      : setFilteredStatuses([...filteredStatuses, status])
  }

  const handleResetButtonClick = () => {
    setSearchString("")
    setActiveTags([])
    setFilteredStatuses([CourseStatus.Active, CourseStatus.Upcoming])
  }

  const filteredCourses = useMemo(
    () =>
      (coursesData?.courses ?? []).filter((course) => {
        if (course.hidden) {
          return false
        }
        if (course.course_translations.length === 0) {
          return false
        }
        if (
          !course.name
            .toLocaleLowerCase(locale)
            .includes(searchString.toLocaleLowerCase(locale)) ||
          !course.description
            ?.toLocaleLowerCase(locale)
            .includes(searchString.toLocaleLowerCase(locale))
        ) {
          return false
        }
        if (activeTags.length > 0) {
          if (!activeTags.every((tag) => courseHasTag(course, tag))) {
            return false
          }
        }
        if (filteredStatuses.length > 0 && course.status) {
          if (!filteredStatuses.includes(CourseStatus[course.status])) {
            return false
          }
        }
        return true
      }),
    [coursesData, searchString, activeTags, filteredStatuses],
  )

  const TagSelectComponent = useMemo(() => {
    if (isNarrow) {
      return DynamicTagSelectDropdowns
    }
    return DynamicTagSelectButtons
  }, [isNarrow])

  return (
    <Container>
      <FiltersContainer>
        <SearchBar
          id="searchCourses"
          label={t("search")}
          value={searchString}
          autoComplete="off"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchString(e.target.value)
          }
        />
        <StyledBorderedSection title={t("filter")}>
          <Filters>
            <TagSelectComponent
              tags={tags}
              activeTags={activeTags}
              setActiveTags={setActiveTags}
              selectAllTags={() => setActiveTags([...(tagsData?.tags ?? [])])}
            />
            <Statuses>
              {(["Active", "Upcoming", "Ended"] as const).map((status) => (
                <FormControlLabel
                  label={t(status)}
                  key={status}
                  control={
                    <Checkbox
                      id={status}
                      checked={filteredStatuses.includes(status)}
                      onChange={() => handleStatusChange(status)}
                    />
                  }
                />
              ))}
            </Statuses>
            <ResetFiltersButton
              id="resetFiltersButton"
              variant="outlined"
              onClick={handleResetButtonClick}
              startIcon={<ClearIcon />}
            >
              {t("reset")}
            </ResetFiltersButton>
          </Filters>
        </StyledBorderedSection>
      </FiltersContainer>
      {coursesLoading ? (
        <CardContainer>
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </CardContainer>
      ) : (
        <CardContainer>
          {filteredCourses.sort(compareCourses).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {filteredCourses.length === 0 && (
            <li style={{ width: "100%" }}>no courses</li>
          )}
        </CardContainer>
      )}
    </Container>
  )
}

export default CourseGrid
