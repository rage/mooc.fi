import styled from "@emotion/styled"
import { Button } from "@mui/material"

import OutboundLink from "/components/OutboundLink"
import BannerImage from "/static/images/homeBackground.jpg"
import SponsorLogo from "/static/images/new/components/courses/f-secure_logo.png"

import { CourseFieldsFragment } from "/graphql/generated"

const colorSchemes = {
  csb: ["#090979", "#00d7ff"],
  programming: ["#791779", "#ff00e2"],
  cloud: ["#832525", "#ff0000"],
  ai: ["#2c8325", "#00ff13"],
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 20% 80%;
  grid-template-columns: 100%;
  border: 1px solid rgba(236, 236, 236, 1);
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  &:nth-child(n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["cloud"][0]} 66%,
      ${colorSchemes["cloud"][1]} 100%
    );
  }
  &:nth-child(2n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["programming"][0]} 66%,
      ${colorSchemes["programming"][1]} 100%
    );
  }
  &:nth-child(3n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["csb"][0]} 66%,
      ${colorSchemes["csb"][1]} 100%
    );
  }
  &:nth-child(4n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["ai"][0]} 66%,
      ${colorSchemes["ai"][1]} 100%
    );
  }
  &.with-background-image {
    background: url(${BannerImage});
  }
`

const TitleContainer = styled.div`
  padding: 1rem 2.5rem 1rem 2.5rem;
  display: flex;
`

const ContentContainer = styled.div`
  display: grid;
  padding: 0.5rem 1.5rem 0.1rem 1.5rem;
  grid-template-columns: 67% 33%;
  grid-template-rows: 50% 30% 20%;
  background: rgba(255, 255, 255, 1);
`

const Title = styled.div`
  font-weight: bold;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.2rem;
  align-self: center;

  &.with-background-image {
    color: black;
    background-color: white;
    padding: 0.5rem 3rem;
  }
`

const Sponsor = styled.img`
  max-width: 9rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 1);
  padding: 1rem;
  justify-self: right;
`

const Description = styled.div`
  padding: 1rem 0;
`

const Schedule = styled.div``

const Details = styled.div`
  display: flex;
  justify-content: right;
  padding: 1rem;
`

const Link = styled(OutboundLink)`
  justify-self: right;
  margin: 1rem;
`

const Tags = styled.div``

const Tag = styled(Button)`
  border-radius: 2rem;
  background-color: #378170 !important;
  border-color: #378170 !important;
  color: #fff !important;
  font-weight: bold;
  margin: 0 0.1rem;
`

interface CourseCardProps {
  course?: CourseFieldsFragment | null
  tags?: string[]
  fifthElement?: boolean
}

function CourseCard({ course, tags, fifthElement }: CourseCardProps) {
  return course ? (
    <Container className={fifthElement ? "with-background-image" : ""}>
      <TitleContainer>
        <Title className={fifthElement ? "with-background-image" : ""}>
          {course?.name}
        </Title>
      </TitleContainer>
      <ContentContainer>
        <Description>{course?.description}</Description>
        <Details>
          {course.ects && (
            <>
              ~{parseInt(course.ects) * 27}h ({course.ects}ects)
            </>
          )}
          <br />
          {/* TODO: add information regarding university/organization to course */}
          Helsingin yliopisto
        </Details>
        <Schedule>
          {course?.status == "Upcoming" ? (
            <p>Tulossa {course.start_date && Date.parse(course.start_date)}</p>
          ) : course?.status == "Ended" ? (
            <p>Päättynyt {course.end_date && Date.parse(course.end_date)}</p>
          ) : (
            <p>
              Käynnissä{" "}
              {course?.end_date ? (
                <>
                  {Date.parse(course?.start_date)} -{" "}
                  {Date.parse(course?.end_date)}
                </>
              ) : (
                <>— Aikatauluton</>
              )}
            </p>
          )}
        </Schedule>
        <Sponsor src={SponsorLogo} />
        <Tags>
          {tags?.map((tag) => (
            <Tag size="small" variant="contained" disabled>
              {tag}
            </Tag>
          ))}
        </Tags>
        <Link eventLabel="to_course_material" to="https://www.mooc.fi">
          Näytä kurssi
        </Link>
      </ContentContainer>
    </Container>
  ) : (
    <Container>
      <TitleContainer>
        <Title>loading...</Title>
      </TitleContainer>
      <ContentContainer>
        <Description>loading...</Description>
      </ContentContainer>
    </Container>
  )
}

export default CourseCard
