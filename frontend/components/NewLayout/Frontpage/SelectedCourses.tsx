import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { formatDateTime } from "/components/DataFormatFunctions"
import { AllCoursesQuery } from "/graphql/queries/courses"
import {
  AllCourses,
  AllCourses_courses,
} from "/static/types/generated/AllCourses"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import notEmpty from "/util/notEmpty"
import moocLogoUrl from "/static/images/moocfi.svg"
import {
  CardBody,
  CardDescription,
  CardWrapper,
} from "/components/NewLayout/Common/Card"
import { CardTitle } from "/components/Text/headers"
import { SectionContainer, SectionTitle } from "/components/NewLayout/Common"

const CardHeader = styled.div`
  position: relative;
  background-color: #ffad14;
  height: 52px;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow: hidden;
`

/*  &:before {
    content: "";
    position: absolute;
    top: 20%;
    left: 60%;
    width: 100%;
    height: 100%;
    background-image: url(${require("/static/images/moocfi.svg")});
    background-clip: content-box;{...props}
    background-repeat: no-repeat;
    background-size: 40%;
    filter: opacity(0.4);
  }
  &:after {
    position: relative;
  }
*/

const BackgroundImage = styled.img`
  opacity: 0.4;
  position: absolute;
  left: 70%;
  top: 0.5rem;
  width: 25%;
  height: auto;
  clip: rect(0, auto, calc(52px - 1rem), auto);
  z-index: 0;
`

const CardActionArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Date = styled((props: any) => (
  <Typography variant="subtitle2" {...props} />
))``

const CourseCard = ({
  name,
  description,
  start_date,
  end_date,
}: AllCourses_courses) => {
  const date =
    start_date && end_date
      ? `${formatDateTime(start_date)} - ${formatDateTime(end_date)}`
      : "Jatkuva kurssi"

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <BackgroundImage src={moocLogoUrl} />
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

export const CoursesGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;
`

function SelectedCourses() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery<AllCourses>(AllCoursesQuery, {
    variables: { language },
  })

  return (
    <SectionContainer>
      <SectionTitle>Suosittuja kursseja</SectionTitle>
      {loading && <p>Loading...</p>}
      <CoursesGrid>
        {data?.courses &&
          data.courses
            .slice(0, 3)
            .filter(notEmpty)
            .map((course, index) => (
              <CourseCard key={`course-${index}`} {...course} />
            ))}
      </CoursesGrid>
    </SectionContainer>
  )
}

export default SelectedCourses
