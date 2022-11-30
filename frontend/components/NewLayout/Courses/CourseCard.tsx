import { Button, Skeleton, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CardTitle } from "../Common/Card"
import OutboundLink from "/components/OutboundLink"
import moocLogoUrl from "/static/images/moocfi_white.svg"
import SponsorLogo from "/static/images/new/components/courses/f-secure_logo.png"

import { CourseFieldsFragment } from "/graphql/generated"

const colorSchemes = {
  csb: "#08457A",
  programming: "#065853",
  cloud: "#1A2333",
  ai: "#51309F",
}

/* Needed in a later PR for the custom tag colors per tag type
const difficultyTags = ["beginner", "intermediate", "advanced"]
const moduleTags = ["AI", "programming", "cloud", "cyber security"]
const languageTags = ["fi", "en", "se"] */

const ContainerBase = css`
  display: grid;
  grid-template-rows: 1fr 4fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  max-height: 400px;
`

const Container = styled("li", {
  shouldForwardProp: (prop) => prop !== "backgroundImage",
})<{ backgroundImage?: string }>`
  ${ContainerBase};
  &:nth-of-type(n) {
    background: ${colorSchemes["cloud"]};
  }
  &:nth-of-type(2n) {
    background: ${colorSchemes["programming"]};
  }
  &:nth-of-type(3n) {
    background: ${colorSchemes["csb"]};
  }
  &:nth-of-type(4n) {
    background: ${colorSchemes["ai"]};
  }
`

const SkeletonContainer = styled("li")`
  ${ContainerBase};
  width: 100%;
  background-color: #eee;
`

const TitleContainer = styled("div")`
  position: relative;
  padding: 1rem 2.5rem 1rem 2.5rem;
  display: flex;
`

const ContentContainer = styled("div")`
  display: grid;
  padding: 0.5rem 1.5rem 0.1rem 1.5rem;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 5fr 3fr 2fr;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  z-index: 1;
  border-radius: 0 0 0.5rem 0.5rem;
`

const Title = styled(CardTitle)`
  font-weight: bold;
  color: white;
  font-size: 1.5rem;
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.2rem;
  align-self: center;
`

const Sponsor = styled("img")`
  max-width: 9rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 1);
  padding: 1rem;
  justify-self: right;
`

const Description = styled("div")`
  padding: 1rem 0;
`

const Schedule = styled("div")``

const Details = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem;
`

const Link = styled(OutboundLink)`
  justify-self: right;
  margin: 1rem;
`

const Tags = styled("div")``

const Tag = styled(Button)`
  border-radius: 2rem;
  background-color: #378170 !important;
  border-color: #378170 !important;
  color: #fff !important;
  font-weight: bold;
  margin: 0 0.1rem;
`

const CardHeaderImage = styled("img")`
  opacity: 0.4;
  position: absolute;
  left: 60%;
  top: 0.5rem;
  width: 35%;
  height: auto;
  z-index: 0;
`

const MoocfiLogo = styled(CardHeaderImage)``

const prettifyDate = (date: string) =>
  date.split("T").shift()?.split("-").reverse().join(".")

/*  Coming in a later PR for the custom colors
  const tagType = (tag: string) =>
  difficultyTags.includes(tag)
    ? "difficulty"
    : moduleTags.includes(tag)
    ? "module"
    : languageTags.includes(tag)
    ? "language"
    : "unknown" */

interface CourseCardProps {
  course: CourseFieldsFragment
  tags?: string[]
}

function CourseCard({ course, tags }: CourseCardProps) {
  return (
    <Container>
      <TitleContainer>
        <Title>
          <Typography variant="h4">{course?.name}</Typography>
        </Title>
        <MoocfiLogo alt="MOOC logo" src={moocLogoUrl} />
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
          ) : course?.status == "Ended" ? (
            <p>
              Päättynyt{" "}
              {course.end_date &&
                Date.parse(course.end_date) < Date.now() &&
                prettifyDate(course.end_date)}
            </p>
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
            <Tag
              size="small"
              variant="contained"
              disabled
              /*  Coming in a later PR for the custom colors
                color={
                tagType(tag) == "difficulty"
                  ? "spgray"
                  : tagType(tag) == "module"
                  ? "sppurple"
                  : "spblue"
              } */
            >
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
