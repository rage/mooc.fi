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
import moocLogo from "/public/images/new/logos/moocfi-transparent.svg"
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

const CardActions = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CourseDate = (props: TypographyProps) => (
  <Typography variant="subtitle2" {...props} />
)

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
        <CardHeaderImage
          alt="MOOC logo"
          src={moocLogo}
          width={200}
          height={200}
        />
      </CardHeader>
      <CardBody>
        <CardDescription>{description}</CardDescription>
        <CardActions>
          <CourseDate>{date}</CourseDate>
          <Button>Kurssin tiedot</Button>
        </CardActions>
      </CardBody>
    </CardWrapper>
  )
}

export const CoursesGrid = styled("div")(
  ({ theme }) => `
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  padding: 2rem;
  justify-content: center;
  width: 80%;

  ${theme.breakpoints.down("sm")} {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`,
)

function SelectedCourses() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)
  const { loading, data } = useQuery(CoursesDocument, {
    variables: { language },
    ssr: false,
  })

  return (
    <SectionContainer id="courses">
      <SectionTitle>Suosittuja kursseja</SectionTitle>
      {loading && <p>Loading...</p>}
      <CoursesGrid>
        {data?.courses &&
          data.courses
            .slice(0, 3)
            .map((course) => (
              <CommonCourseCard key={course.id} course={course} />
            ))}
      </CoursesGrid>
      <Button href="/_new/courses">Näytä kaikki kurssit</Button>
    </SectionContainer>
  )
}

export default SelectedCourses
