import { useMemo, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import ClearIcon from "@mui/icons-material/Clear"
import {
  Button,
  ButtonProps,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseCard, { CourseCardSkeleton } from "./CourseCard"
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
  max-width: 1536px;
  padding: 1rem;
`

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

const Filters = styled("div")`
  margin: 1rem 0 1rem 0;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 5% 50% 30% 10%;
  grid-gap: 1rem;
`

const FilterLabel = styled("div")`
  align-self: center;
  margin-right: 1rem;
`

const TagButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "variant",
})<ButtonProps & { variant: string }>`
  border-radius: 2rem;
  margin: 0.05rem 0.2rem;
  font-weight: bold;
  border-width: 0.15rem;
  color: ${({ variant }) => (variant === "contained" ? "#F5F6F7" : "#378170")};
  background-color: ${({ variant }) =>
    variant === "contained" ? "#378170" : "#F5F6F7"};

  &:hover {
    border-width: 0.15rem;
    background-color: ${({ variant }) =>
      variant === "contained" ? "#378170" : "#F5F6F7"};
  }
`

const SelectAllButton = styled(TagButton)`
  margin: auto;
  margin-right: 1rem;
`

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

const TagsContainer = styled("div")`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 0.5rem;
`

const TypedTagsContainer = styled("div")`
  display: flex;
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

function CourseGrid() {
  const t = useTranslator(CommonTranslations)
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading: coursesLoading, data: coursesData } = useQuery(
    CoursesDocument,
    {
      variables: { language },
    },
  )

  // @ts-ignore: tagsLoading not used for now
  const { loading: tagsLoading, data: tagsData } = useQuery(
    CourseCatalogueTagsDocument,
    {
      variables: { language },
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
          acc[t] = (acc[t] ?? []).concat(curr)
        })
        return acc
      }, {} as Record<string, Array<TagCoreFieldsFragment>>),
    [tagsData],
  )
  // TODO: set tags on what tags are found from courses in db? or just do a hard-coded list of tags?

  const handleClick = (tag: TagCoreFieldsFragment) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag))
    } else {
      setActiveTags([...activeTags, tag])
    }
  }

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

  const handleSelectAllClick = (category: string) => {
    if (category in tags) {
      if (tags[category].every((tag) => activeTags.includes(tag))) {
        setActiveTags(activeTags.filter((tag) => !tags[category].includes(tag)))
      } else {
        const activeTagsWithAll = [...activeTags, ...tags[category]]
        setActiveTags([...new Set(activeTagsWithAll)])
      }
    } else {
      setActiveTags([...(tagsData?.tags ?? [])])
    }
  }

  // TODO: need some preset order for tag categories
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
        <Filters>
          <FilterLabel>{t("filter")}:</FilterLabel>
          <TagsContainer>
            {Object.keys(tags).map((category) => (
              <TypedTagsContainer key={category}>
                <div style={{ gridArea: `${category}Tags` }}>
                  {tags[category].map((tag) => (
                    <TagButton
                      id={`tag-${category}-${tag.id}`}
                      key={tag.id}
                      variant={
                        activeTags.includes(tag) ? "contained" : "outlined"
                      }
                      onClick={() => handleClick(tag)}
                      size="small"
                    >
                      {tag.name}
                    </TagButton>
                  ))}
                </div>
                <SelectAllButton
                  id={`select-all-${category}-tags`}
                  variant={
                    tags[category].every((tag) => activeTags.includes(tag))
                      ? "contained"
                      : "outlined"
                  }
                  style={{ gridArea: `${category}SelectAll` }}
                  onClick={() => handleSelectAllClick(category)}
                  size="small"
                >
                  {t("selectAll")}
                </SelectAllButton>
              </TypedTagsContainer>
            ))}
          </TagsContainer>
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
        </CardContainer>
      )}
    </Container>
  )
}

export default CourseGrid
