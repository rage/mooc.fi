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

const CardWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border: 1px solid #ececec;
  min-height: 300px;
  overflow: hidden;
`

const _CardHeader = styled.div`
  background-color: #ffad14;
  height: 52px;
  padding-left: 2rem;
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
    background-clip: content-box;
    background-repeat: no-repeat;
    background-size: 40%;
    filter: opacity(0.4);
  }
  &:after {
    position: relative;
  }
*/

const BackgroundImage = styled.img`
  opacity: 0.6;
  position: absolute;
  left: 70%;
  top: 0.5rem;
  width: 28%;
  height: auto;
  clip: rect(0, auto, calc(52px - 0.5rem), auto);
  z-index: 0;
`

const CardHeader = ({ children }: { children: JSX.Element }) => {
  return (
    <_CardHeader>
      {children}
      <BackgroundImage src={require("../../static/images/moocfi.svg")} />
    </_CardHeader>
  )
}

const CardBody = styled.div`
  background-color: #fff;
  z-index: 100;
  height: 100%;
  padding: 2rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Date = styled.div``

const Title = styled(Typography)`
  z-index: 4;
  position: relative;
`

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
        <Title variant="h6">{name}</Title>
      </CardHeader>
      <CardBody>
        <Row>{description}</Row>
        <Row>
          <Date>{date}</Date>
          <Button>Kurssin tiedot</Button>
        </Row>
      </CardBody>
    </CardWrapper>
  )
}

const CoursesContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  padding-top: 2rem;
  width: 100%;
`

const CoursesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
`

function SelectedCourses() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, error, data } = useQuery<AllCourses>(AllCoursesQuery, {
    variables: { language },
  })

  return (
    <CoursesContainer>
      <Typography variant="h1">Suosittuja kursseja</Typography>
      {loading && <p>Loading...</p>}
      <CoursesGrid>
        {data?.courses &&
          data.courses
            .slice(0, 3)
            .filter(notEmpty)
            .map((course, index) => <CourseCard key={index} {...course} />)}
      </CoursesGrid>
    </CoursesContainer>
  )
}

export default SelectedCourses
