import { useEffect, useState } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { Button, TextField } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseCard from "./CourseCard"
import CommonTranslations from "/translations/common"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import { useTranslator } from "/util/useTranslator"

import { CoursesDocument } from "/graphql/generated"

const Container = styled("div")`
  display: grid;
  max-width: 1200px;
`

const CardContainer = styled("div")`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 50% 50%;
`

const SearchBar = styled(TextField)`
  margin: 0.5rem 0;
`

const Filters = styled("div")`
  margin: 0 0 1rem 1rem;
  display: flex;
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
    data?.courses?.map((course) =>
      course?.slug != null
        ? (hardcoded[course?.slug] = [...tags]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4))
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
      {loading ? (
        <CardContainer>
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
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
