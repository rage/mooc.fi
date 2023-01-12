import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"

import CourseCard, { CourseCardSkeleton } from "./CourseCard"
import Container from "/components/Container"
import { BackgroundImage } from "/components/Images/GraphicBackground"
import { H2Background, SubtitleBackground } from "/components/Text/headers"

import { CourseFieldsFragment } from "/graphql/generated"

interface RootProps {
  backgroundColor: string
}

const Root = styled("div", {
  shouldForwardProp: (prop) => prop !== "backgroundColor",
})<RootProps>`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  padding-bottom: 4em;
  position: relative;
  ${(props) => `background-color: ${props.backgroundColor};`}
`

const TitleContainer = styled("div")`
  z-index: 20;
`

interface CourseHighlightsProps {
  courses?: CourseFieldsFragment[]
  loading: boolean
  title: string
  headerImage: any
  subtitle?: string
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
  fontColor: string
  titleBackground: string
}

interface CourseListProps {
  courses: CourseFieldsFragment[]
}

const CourseList = ({ courses }: CourseListProps) => {
  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <CourseCard key={`course-${course.id}`} course={course} />
      ))}
    </Grid>
  )
}

const CourseListSkeleton = () => {
  return (
    <Grid container spacing={3}>
      <CourseCardSkeleton key="skeletoncard1" />
      <CourseCardSkeleton key="skeletoncard2" />
    </Grid>
  )
}

const CourseHighlights = (props: CourseHighlightsProps) => {
  const {
    courses,
    loading,
    title,
    headerImage,
    subtitle,
    backgroundColor,
    hueRotateAngle,
    brightness,
    fontColor,
    titleBackground,
  } = props

  return (
    <Root backgroundColor={backgroundColor}>
      <BackgroundImage
        src={require(`../../static/images/${headerImage}`)}
        aria-hidden
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      />

      <TitleContainer>
        <H2Background
          component="h2"
          variant="h2"
          fontcolor={fontColor}
          titlebackground={titleBackground}
        >
          {title}
        </H2Background>
        {subtitle && (
          <SubtitleBackground
            component="div"
            variant="subtitle1"
            fontcolor={fontColor}
          >
            {subtitle}
          </SubtitleBackground>
        )}
      </TitleContainer>
      <Container>
        {loading ? (
          <CourseListSkeleton />
        ) : (
          <CourseList courses={courses ?? []} />
        )}
      </Container>
    </Root>
  )
}

export default CourseHighlights
