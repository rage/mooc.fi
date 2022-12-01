import Link from "next/link"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { Button, Typography, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import { SectionContainer, SectionTitle } from "/components/NewLayout/Common"
import {
  CardBody,
  CardDescription,
  CardHeaderImage,
  CardWrapper,
} from "/components/NewLayout/Common/Card"
import CommonCourseCard from "/components/NewLayout/Courses/CourseCard"
import { CardTitle } from "/components/Text/headers"
import moocLogoUrl from "/static/images/moocfi-transparent.svg"
import { formatDateTime } from "/util/dataFormatFunctions"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import { CourseFieldsFragment, CoursesDocument } from "/graphql/generated"

const CardHeader = styled("div")`
  position: relative;
  background-color: #ffad14;
  height: 52px;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow: hidden;
`

const CardActionArea = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Date = styled((props: TypographyProps) => (
  <Typography variant="subtitle2" {...props} />
))``

// @ts-ignore: not used for now
const CourseCard = ({
  name,
  description,
  start_date,
  end_date,
}: CourseFieldsFragment) => {
  const date =
    start_date && end_date
      ? `${formatDateTime(start_date)} - ${formatDateTime(end_date)}`
      : "Jatkuva kurssi"

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle variant="h4">{name}</CardTitle>
        <CardHeaderImage alt="MOOC logo" src={moocLogoUrl} />
      </CardHeader>
      <CardBody>
        <CardDescription>{description}</CardDescription>
        <CardActionArea>
          <Date>{date}</Date>
          <Button>Kurssin tiedot</Button>
        </CardActionArea>
      </CardBody>
    </CardWrapper>
  )
}

export const CoursesGrid = styled("div")`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;
  @media (max-width: 500px) {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`

function SelectedCourses() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(CoursesDocument, {
    variables: { language },
  })

  return (
    <SectionContainer id="courses">
      <SectionTitle>Suosittuja kursseja</SectionTitle>
      {loading && <p>Loading...</p>}
      <CoursesGrid>
        {data?.courses &&
          data.courses
            .slice(0, 3)
            .map((course, index) => (
              <CommonCourseCard key={`course-${index}`} course={course} />
            ))}
      </CoursesGrid>
      <Link href="/_new/courses" passHref>
        <Button>Näytä kaikki kurssit</Button>
      </Link>
    </SectionContainer>
  )
}

export default SelectedCourses
