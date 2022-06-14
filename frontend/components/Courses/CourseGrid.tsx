import CourseCard from "./CourseCard"
import { AllCoursesQuery } from "/graphql/queries/courses"
import { useQuery } from "@apollo/client"
import { AllCourses } from "/static/types/generated/AllCourses"
import styled from "@emotion/styled"
import { Button, TextField } from "@mui/material"
import { useTranslator } from "/util/useTranslator"
import CommonTranslations from "/translations/common"
import { useEffect, useState } from "react"

const Container = styled.div`
  display: grid;
`

const CardContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 50% 50%;
`

const SearchBar = styled(TextField)`
  margin: 0.5rem 0;
`

const Filters = styled.div`
  margin: 0 0 1rem 1rem;
  display: flex;
`

const FilterLabel = styled.div`
  align-self: center;
  margin-right: 1rem;
`

const TagButton = styled(Button)`
  border-radius: 2rem;
  margin: 0 0.2rem;
  font-weight: bold;
  border-width: 0.15rem;
`

function useCourseSearch() {
  const { data: coursesData } = useQuery<AllCourses>(AllCoursesQuery)

  return {
    data: coursesData,
  }
}

function CourseGrid() {
  const t = useTranslator(CommonTranslations)
  const { data } = useCourseSearch()
  const [searchString, setSearchString] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [hardcodedTags, setHardcodedTags] = useState<{
    [key: string]: string[]
  }>({})

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

    const hardcoded: { [key: string]: string[] } = {}
    const difficultyTags = ["beginner", "intermediate", "pro"]
    const otherTags = ["AI", "programming", "cloud", "cyber security"]

    data?.courses?.map((course) =>
      course?.slug != null
        ? (hardcoded[course?.slug] = [
            difficultyTags[Math.floor(Math.random() * difficultyTags.length)],
          ].concat([otherTags[Math.floor(Math.random() * otherTags.length)]]))
        : "undefined",
    )
    setHardcodedTags(hardcoded)
  }, [])

  const handleClick = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag))
    } else {
      setActiveTags([...activeTags, tag])
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
      </Filters>
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
    </Container>
  )
}

export default CourseGrid
