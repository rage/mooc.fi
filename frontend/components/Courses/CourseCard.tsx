import styled from "@emotion/styled"
import { Button } from "@mui/material"

import SponsorLogo from "../../static/images/components/courses/f-secure_logo.png"
import BannerImage from "../../static/images/homeBackground.jpg"
import OutboundLink from "../OutboundLink"

import { CourseFieldsFragment } from "/graphql/generated"

const colorSchemes = {
  csb: ["#020024", "#090979", "#00d7ff"],
  programming: ["#1b0024", "#791779", "#ff00e2"],
  cloud: ["#160a01", "#a35e27", "#ff7900"],
  ai: ["#161601", "#a3a127", "#fffa00"],
}

const Container = styled.div`
  border: 1px solid rgba(236, 236, 236, 1);
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  &:nth-child(n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["cloud"][0]} 0%,
      ${colorSchemes["cloud"][1]} 35%,
      ${colorSchemes["cloud"][2]} 100%
    );
  }
  &:nth-child(2n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["programming"][0]} 0%,
      ${colorSchemes["programming"][1]} 35%,
      ${colorSchemes["programming"][2]} 100%
    );
  }
  &:nth-child(3n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["csb"][0]} 0%,
      ${colorSchemes["csb"][1]} 35%,
      ${colorSchemes["csb"][2]} 100%
    );
  }
  &:nth-child(4n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["ai"][0]} 0%,
      ${colorSchemes["ai"][1]} 35%,
      ${colorSchemes["ai"][2]} 100%
    );
  }
  &:nth-child(5n) {
    background: url(${BannerImage});
  }
`

const TitleContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  grid-template-columns: 67% 33%;
  grid-template-rows: 100%;
`

const ContentContainer = styled.div`
  display: grid;
  grid-gap: 1rem 2rem;
  padding: 0.5rem 1.5rem 0.1rem 1.5rem;
  grid-template-columns: 67% 33%;
  grid-template-rows: 67% 33%;
  background: rgba(255, 255, 255, 1);
`

const Title = styled.div`
  font-weight: bold;
  text-align: center;
  background: rgba(255, 255, 255, 1);
  padding: 0.5rem;
  border-radius: 0.2rem;
`

const Sponsor = styled.img`
  max-width: 9rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 1);
  padding: 1rem;
`

const Description = styled.div``

const Schedule = styled.div``

const Details = styled.div``

const Link = styled(OutboundLink)`
  align-self: end;
  margin: 1rem;
`

const BottomLeftContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Tags = styled.div``

const Tag = styled(Button)`
  border-radius: 2rem;
  background-color: #378170 !important;
  border-color: #378170 !important;
  color: #fff !important;
  font-weight: bold;
  margin: 0.1rem;
`

interface CourseCardProps {
  course?: CourseFieldsFragment | null
  tags?: string[]
}

function CourseCard({ course, tags }: CourseCardProps) {
  return course ? (
    <Container>
      <TitleContainer>
        <Title>{course?.name}</Title>
      </TitleContainer>
      <ContentContainer>
        <Description>{course?.description}</Description>
        <Details>
          {course.ects && (
            <>
              ~{parseInt(course.ects) * 27} ({course.ects})
            </>
          )}
          Helsingin yliopisto
          <Sponsor src={SponsorLogo} />
        </Details>
        <BottomLeftContainer>
          <Schedule>
            {course.status}{" "}
            {course?.end_date ? (
              <>
                Aikataulutettu
                <br />
                {course?.start_date} - {course?.end_date}
              </>
            ) : (
              <>Aikatauluton</>
            )}
          </Schedule>
        </BottomLeftContainer>
        <Link eventLabel="to_course_material" to="https://www.mooc.fi">
          Näytä kurssi
        </Link>
        <Tags>
          {tags?.map((tag) => (
            <Tag size="small" variant="contained" disabled>
              {tag}
            </Tag>
          ))}
        </Tags>
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
