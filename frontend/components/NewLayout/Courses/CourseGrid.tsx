import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import ClearIcon from "@mui/icons-material/Clear"
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseCard, { CourseCardSkeleton } from "./CourseCard"
import CommonTranslations from "/translations/common"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import { useTranslator } from "/util/useTranslator"

import { CoursesDocument, CourseStatus } from "/graphql/generated"

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
  max-width: 1200px;
  padding: 1rem;
`

const CardContainer = styled("div")`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

const SearchBar = styled(TextField)`
  margin: 0.5rem 0;
`

const Filters = styled("div")`
  margin: 0 0 1rem 1rem;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 5% 50% 30% 10%;
  grid-gap: 1rem;
`

const FilterLabel = styled("div")`
  align-self: center;
  margin-right: 1rem;
`

const TagButton = styled(Button)`
  border-radius: 2rem;
  margin: 0.05rem 0.2rem;
  font-weight: bold;
  border-width: 0.15rem;

  &:hover {
    border-width: 0.15rem;
  }
`

const Tags = styled("div")`
  align-self: center;
`

const Statuses = styled("div")`
  justify-self: end;
`

const ResetFiltersButton = styled(Button)`
  border-radius: 1rem;
  font-weight: bold;
  border-width: 0.15rem;
  max-height: 2.5rem;
`

const TagsContainer = styled("div")`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 70% 30%;
`

const SelectAllContainer = styled("div")``

function CourseGrid() {
  const t = useTranslator(CommonTranslations)
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(CoursesDocument, {
    variables: { language },
  })
  const [searchString, setSearchString] = useState<string>("")
  /* const [tags, setTags] = useState<string[]>([]) */
  const [languageTags, setLanguageTags] = useState<string[]>([])
  const [difficultyTags, setDifficultyTags] = useState<string[]>([])
  const [moduleTags, setModuleTags] = useState<string[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [hardcodedTags, setHardcodedTags] = useState<{
    [key: string]: string[]
  }>({})
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([
    CourseStatus.Active,
    CourseStatus.Upcoming,
  ])

  // TODO: set tags on what tags are found from courses in db? or just do a hard-coded list of tags?

  useEffect(() => {
    /* setTags([
      "beginner",
      "intermediate",
      "pro",
      "AI",
      "programming",
      "cloud",
      "cyber security",
      "fi",
      "en",
      "se",
    ]) */
    setDifficultyTags(["beginner", "intermediate", "advanced"])
    setModuleTags(["AI", "programming", "cloud", "cyber security"])
    setLanguageTags(["fi", "en", "se"])
  }, [])

  useEffect(() => {
    const hardcoded: { [key: string]: string[] } = {}
    data?.courses &&
      data.courses.map((course) =>
        course?.slug != null
          ? (hardcoded[course?.slug] = [
              ...difficultyTags,
              ...moduleTags,
              ...languageTags,
            ]
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.random() * (4 - 3) + 3))
          : "undefined",
      )
    setHardcodedTags(hardcoded)
  }, [difficultyTags, moduleTags, languageTags])

  const handleClick = (tag: string) => {
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
    switch (category) {
      case "difficulty":
        if (difficultyTags.every((tag) => activeTags.includes(tag))) {
          setActiveTags(
            activeTags.filter((tag) => !difficultyTags.includes(tag)),
          )
        } else {
          let activeTagsWithAllDifficulties = [...activeTags, ...difficultyTags]
          activeTagsWithAllDifficulties = [
            ...new Set(activeTagsWithAllDifficulties),
          ]
          setActiveTags(activeTagsWithAllDifficulties)
        }
        break
      case "module":
        if (moduleTags.every((tag) => activeTags.includes(tag))) {
          setActiveTags(activeTags.filter((tag) => !moduleTags.includes(tag)))
        } else {
          let activeTagsWithAllDifficulties = [...activeTags, ...moduleTags]
          activeTagsWithAllDifficulties = [
            ...new Set(activeTagsWithAllDifficulties),
          ]
          setActiveTags(activeTagsWithAllDifficulties)
        }
        break
      case "language":
        if (languageTags.every((tag) => activeTags.includes(tag))) {
          setActiveTags(activeTags.filter((tag) => !languageTags.includes(tag)))
        } else {
          let activeTagsWithAllDifficulties = [...activeTags, ...languageTags]
          activeTagsWithAllDifficulties = [
            ...new Set(activeTagsWithAllDifficulties),
          ]
          setActiveTags(activeTagsWithAllDifficulties)
        }
        break
      default:
        setActiveTags([...difficultyTags, ...moduleTags, ...languageTags])
    }
  }

  return (
    <Container>
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
          <Tags>
            {difficultyTags.map((tag) => (
              <TagButton
                id={`difficulty-tag-${tag}`}
                variant={activeTags.includes(tag) ? "contained" : "outlined"}
                onClick={() => handleClick(tag)}
                size="small"
              >
                {tag}
              </TagButton>
            ))}
            <br />
            {moduleTags.map((tag) => (
              <TagButton
                id={`module-tag-${tag}`}
                variant={activeTags.includes(tag) ? "contained" : "outlined"}
                onClick={() => handleClick(tag)}
                size="small"
              >
                {tag}
              </TagButton>
            ))}
            <br />
            {languageTags.map((tag) => (
              <TagButton
                id={`language-tag-${tag}`}
                variant={activeTags.includes(tag) ? "contained" : "outlined"}
                onClick={() => handleClick(tag)}
                size="small"
              >
                {tag}
              </TagButton>
            ))}
          </Tags>
          <SelectAllContainer>
            <TagButton
              id="select-all-difficulty-tags"
              variant={
                difficultyTags.every((tag) => activeTags.includes(tag))
                  ? "contained"
                  : "outlined"
              }
              onClick={() => handleSelectAllClick("difficulty")}
              size="small"
            >
              {t("selectAll")}
            </TagButton>
            <TagButton
              id="select-all-module-tags"
              variant={
                moduleTags.every((tag) => activeTags.includes(tag))
                  ? "contained"
                  : "outlined"
              }
              onClick={() => handleSelectAllClick("module")}
              size="small"
            >
              {t("selectAll")}
            </TagButton>
            <TagButton
              id="select-all-difficulties"
              variant={
                languageTags.every((tag) => activeTags.includes(tag))
                  ? "contained"
                  : "outlined"
              }
              onClick={() => handleSelectAllClick("language")}
              size="small"
            >
              {t("selectAll")}
            </TagButton>
          </SelectAllContainer>
        </TagsContainer>
        <Statuses>
          {["Active", "Upcoming", "Ended"].map((status) => (
            <FormControlLabel
              label={t(status as any)}
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
      {loading ? (
        <CardContainer>
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </CardContainer>
      ) : (
        <CardContainer>
          {data?.courses &&
            data.courses
              .filter(
                (course) =>
                  !course.hidden &&
                  course.course_translations.length > 0 &&
                  (course?.name
                    .toLowerCase()
                    .includes(searchString.toLowerCase()) ||
                    course?.description
                      ?.toLowerCase()
                      .includes(searchString.toLowerCase())) &&
                  (activeTags.length > 0
                    ? activeTags.every((tag) =>
                        hardcodedTags[course?.slug].includes(tag),
                      )
                    : true) &&
                  (filteredStatuses.length > 0 && course.status
                    ? filteredStatuses.includes(CourseStatus[course.status])
                    : true),
              )
              .map((course) => (
                <CourseCard
                  course={course}
                  tags={
                    course?.slug ? hardcodedTags[course?.slug] : ["undefined"]
                  }
                />
              ))}
        </CardContainer>
      )}
    </Container>
  )
}

export default CourseGrid
