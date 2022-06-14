import styled from "@emotion/styled"
import OutboundLink from "../OutboundLink"
import { AllCourses_courses } from "/static/types/generated/AllCourses"
import SponsorLogo from "../../../f-secure_logo.png"
import BannerImage from "../../static/images/homeBackground.jpg"
import { Button } from "@mui/material"

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
  width: 578px;
  height: 267px;
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
  max-width: 7rem;
  margin-left: 4rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 1);
  padding: 0.2rem;
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
  course?: AllCourses_courses | null
  tags?: string[]
}

function CourseCard({ course, tags }: CourseCardProps) {
  return (
    <Container>
      <TitleContainer>
        <Title>{course?.name}</Title>
        <Sponsor src={SponsorLogo} />
      </TitleContainer>
      <ContentContainer>
        {/*         <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Description> */}
        <Description>{course?.description}</Description>
        <Details>
          englanti
          <br />
          ~135h (5 op)
          <br />
          Edistynyt
          <br />
          Helsingin yliopisto
        </Details>
        <BottomLeftContainer>
          <Schedule>
            Aikataulutettu
            <br />
            6.9.2021-31.12.2021
          </Schedule>
          <Tags>
            {tags?.map((tag) => (
              <Tag size="small" variant="contained" disabled>
                {tag}
              </Tag>
            ))}
          </Tags>
        </BottomLeftContainer>
        <Link eventLabel="derp" to="https://www.mooc.fi">
          Näytä kurssi
        </Link>
      </ContentContainer>
    </Container>
  )
}

export default CourseCard
