import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import { Button, Typography } from "@mui/material"

import { formatDateTime } from "/components/DataFormatFunctions"
import { SectionContainer, SectionTitle } from "/components/NewLayout/Common"
import {
  CardBody,
  CardDescription,
  CardHeaderImage,
  CardWrapper,
} from "/components/NewLayout/Common/Card"
import { CardTitle } from "/components/Text/headers"
import MoocLogo from "/static/images/moocfi.svg?component"
// import moocLogoUrl from "/static/images/moocfi.svg"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"
import notEmpty from "/util/notEmpty"

import { CourseFieldsFragment, CoursesDocument } from "/graphql/generated"

const CardHeader = styled.div`
  position: relative;
  background-color: #ffad14;
  height: 52px;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  overflow: hidden;
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
}: CourseFieldsFragment) => {
  const date =
    start_date && end_date
      ? `${formatDateTime(start_date)} - ${formatDateTime(end_date)}`
      : "Jatkuva kurssi"

  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <MoocLogo alt="MOOC logo" width="200" height="200" />
        {/*<CardHeaderImage
          alt="MOOC logo"
          src={moocLogo}
          width={200}
          height={200}
        />*/}
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
