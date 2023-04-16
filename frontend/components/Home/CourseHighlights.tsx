import { Grid, useMediaQuery } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseCard from "./CourseCard"
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

const CourseHighlights = (props: CourseHighlightsProps) => {
  // @ts-ignore: not used
  const isMobile = useMediaQuery("(max-width: 600px)", { noSsr: true })
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
        src={headerImage.src}
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
        <Grid container spacing={3}>
          {loading ? (
            <>
              <CourseCard key="skeletoncard1" />
              <CourseCard key="skeletoncard2" />
            </>
          ) : (
            courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </Grid>
      </Container>
    </Root>
  )
}

export default CourseHighlights
