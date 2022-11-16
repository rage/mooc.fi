import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Button, Skeleton, Typography } from "@mui/material"

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

const ContainerBase = css`
  display: grid;
  grid-template-rows: 1fr 4fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  max-height: 400px;
`

const Container = styled.li<{ backgroundImage?: string }>`
  ${ContainerBase};
  &:nth-of-type(n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["cloud"][0]} 66%,
      ${colorSchemes["cloud"][1]} 100%
    );
  }
  &:nth-of-type(2n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["programming"][0]} 66%,
      ${colorSchemes["programming"][1]} 100%
    );
  }
  &:nth-of-type(3n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["csb"][0]} 66%,
      ${colorSchemes["csb"][1]} 100%
    );
  }
  &:nth-of-type(4n) {
    background: linear-gradient(
      90deg,
      ${colorSchemes["ai"][0]} 66%,
      ${colorSchemes["ai"][1]} 100%
    );
  }
  ${({ backgroundImage }) =>
    backgroundImage &&
    css`
      background: url(${backgroundImage}) !important;
    `}
`

const SkeletonContainer = styled.li`
  ${ContainerBase};
  width: 100%;
  background-color: #eee;
`

const TitleContainer = styled.div`
  padding: 1rem 2.5rem 1rem 2.5rem;
  display: flex;
`

const ContentContainer = styled.div`
  display: grid;
  padding: 0.5rem 1.5rem 0.1rem 1.5rem;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 5fr 3fr 2fr;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  border-radius: 0 0 0.5rem 0.5rem;
`

const Title = styled.div<{ withBackgroundImage?: boolean }>`
  font-weight: bold;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.2rem;
  align-self: center;

  ${({ withBackgroundImage }) =>
    withBackgroundImage &&
    css`
      color: black;
      background-color: white;
      padding: 0.5rem 3rem;
    `}
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
  flex-direction: column;
  align-items: flex-end;
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
const prettifyDate = (date: string) =>
  date.split("T").shift()?.split("-").reverse().join(".")

interface CourseCardProps {
  course: CourseFieldsFragment
  tags?: string[]
  fifthElement?: boolean
}

function CourseCard({ course, tags, fifthElement }: CourseCardProps) {
  return (
    <Container backgroundImage={fifthElement ? BannerImage : undefined}>
      <TitleContainer>
        <Title withBackgroundImage={fifthElement}>
          <Typography variant="h4">{course?.name}</Typography>
        </Title>
      </TitleContainer>
      <ContentContainer>
        <Description>
          <Typography variant="body1">{course?.description}</Typography>
        </Description>
        <Details>
          {course.ects && (
            <Typography variant="subtitle2">
              ~{parseInt(course.ects) * 27}h ({course.ects} ECTS)
            </Typography>
          )}
          {/* TODO: add information regarding university/organization to course */}
          <Typography variant="subtitle2">Helsingin yliopisto</Typography>
        </Details>
        <Schedule>
          {course.status == "Upcoming" ? (
            <p>
              Tulossa {course.start_date && prettifyDate(course.start_date)}
            </p>
          ) : course.status == "Ended" ? (
            <p>Päättynyt {course.end_date && prettifyDate(course.end_date)}</p>
          ) : (
            <p>
              Käynnissä{" "}
              {course.end_date ? (
                <>
                  {prettifyDate(course.start_date)} -{" "}
                  {prettifyDate(course.end_date)}
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
  )
}

export const CourseCardSkeleton = () => (
  <SkeletonContainer>
    <TitleContainer>
      <Title>
        <Typography variant="h4">
          <Skeleton width={100 + Math.random() * 100} />
        </Typography>
      </Title>
    </TitleContainer>
    <ContentContainer>
      <Description>
        <Typography variant="body1">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Typography>
      </Description>
      <Details>
        <Typography variant="subtitle2">
          <Skeleton width={75} />
        </Typography>
      </Details>
      <Schedule>
        <Skeleton />
      </Schedule>
      <Sponsor />
      <Tags />
      <Skeleton />
    </ContentContainer>
  </SkeletonContainer>
)

export default CourseCard
