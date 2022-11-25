import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseCard, { CourseCardSkeleton } from "./CourseCard"
import CommonTranslations from "/translations/common"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import { useTranslator } from "/util/useTranslator"

import { CoursesDocument, CourseStatus } from "/graphql/generated"

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
`

const FilterLabel = styled("div")`
  align-self: center;
  margin-right: 1rem;
`

const TagButton = styled(Button)`
  border-radius: 2rem;
  margin: 0 0.2rem;
  font-weight: bold;
  border-width: 0.15rem;
`

const Tags = styled("div")`
  align-self: center;
`

const Statuses = styled("div")`
  justify-self: end;
`

function CourseGrid() {
  const t = useTranslator(CommonTranslations)
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(CoursesDocument, {
    variables: { language },
  })
  const [searchString, setSearchString] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [hardcodedTags, setHardcodedTags] = useState<{
    [key: string]: string[]
  }>({})
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([])

  // TODO: set tags on what tags are found from courses in db? or just do a hard-coded list of tags?

  useEffect(() => {
    setTags([
      "beginner",
      "intermediate",
      "pro",
      "AI",
      "programming",
      "cloud",
      "cyber security",
    ])
  }, [])

  useEffect(() => {
    const hardcoded: { [key: string]: string[] } = {}
    data?.courses &&
      data.courses.map((course) =>
        course?.slug != null
          ? (hardcoded[course?.slug] = [...tags]
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.random() * (4 - 3) + 3))
          : "undefined",
      )
    setHardcodedTags(hardcoded)
  }, [tags])

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
        <Tags>
          {tags.map((tag) => (
            <TagButton
              id=""
              variant={activeTags.includes(tag) ? "contained" : "outlined"}
              onClick={() => handleClick(tag)}
              size="small"
            >
              {tag}
            </TagButton>
          ))}
        </Tags>
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
              .map((course, index) => (
                <CourseCard
                  course={course}
                  fifthElement={index % 5 == 0 ? true : false}
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
