import { Grid, Typography, Skeleton } from "@material-ui/core"
import styled from "@emotion/styled"
import { CourseStatus } from "/static/types/generated/globalTypes"
import HomeTranslations from "/translations/home"
import { AllCourses_courses } from "/static/types/generated/AllCourses"
import ReactGA from "react-ga"
import { CardTitle } from "components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { useTranslator } from "/util/useTranslator"

const SkeletonTitle = styled(Skeleton)`
  margin-bottom: 0.5rem;
`

const SkeletonText = styled(Skeleton)`
  margin-bottom: 1rem;
`

interface BackgroundProps {
  upcoming?: boolean
  component: string
}

const Background = styled(ClickableButtonBase)<BackgroundProps>`
  display: flex;
  border-radius: 5px;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fcfcfa;
  height: 100%;
  width: 100%;
  ${({ upcoming }) =>
    upcoming
      ? `
    &:after {
      border-left: 80px solid transparent;
      border-right: 80px solid green;
      border-top: 80px solid transparent;
      height: 0;
      width: 0;
      position: absolute;
      right: 0px;
      bottom: 0px;
      content: "";
      z-index: 2;
    }
    &:after.span {
      color: #ffffff;
      font-family: sans-serif;
      font-size: 1.005em;
      right: 0px;
      bottom: 83px;
      position: absolute;
      width: 60px;
    }
  `
      : undefined}
  @media (min-width: 960px) {
    min-height: 150px;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    min-height: 250px;
  }
`

const ContentArea = styled.div`
  padding: 1rem 1rem 2rem 1rem;
  flex-direction: column;
  display: flex;
  flex: 1;
`

interface HeaderProps {
  startPoint?: boolean | null
  upcoming?: boolean | null
}

const Header = styled.div<HeaderProps>`
  padding-top: 0.5rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-bottom: 0.5rem;
  justify-content: center;
  top: 0;
  left: 0;
  color: #ffffff;
  background-color: ${({ startPoint, upcoming }) =>
    upcoming ? "#378170" : startPoint ? "#005A84" : "#158278"};
  width: 100%;
  display: flex;
`

interface ModuleSmallCourseCardProps {
  course?: AllCourses_courses
  showHeader?: boolean
}

function ModuleSmallCourseCard({
  course,
  showHeader,
}: ModuleSmallCourseCardProps) {
  const t = useTranslator(HomeTranslations)

  return (
    <Grid item xs={12} sm={6} md={12} lg={6} xl={4}>
      <Background focusRipple component="div">
        {course ? (
          <ReactGA.OutboundLink
            eventLabel={`modulecoursesite: ${course ? course.name : ""}`}
            to={course.link ?? ""}
            target="_blank"
            style={{ textDecoration: "none", width: "100%" }}
            onClick={(e) => (course.link === "" ? e.preventDefault() : null)}
            aria-label={`To the course homepage of ${course.name}`}
          >
            {showHeader &&
              (course!.study_module_start_point ||
                course!.status === CourseStatus.Upcoming) && (
                <Header
                  startPoint={course!.study_module_start_point}
                  upcoming={course!.status === "Upcoming"}
                >
                  <Typography variant="body1">
                    {course!.status === "Upcoming"
                      ? t("upcomingShort")
                      : t("moduleCourseStartPoint")}
                  </Typography>
                </Header>
              )}
            <ContentArea>
              <CardTitle component="h3" align="center" variant="h3">
                {course.name}
              </CardTitle>
              <CardText component="p" paragraph variant="body1" align="left">
                {course.description}
              </CardText>
            </ContentArea>
          </ReactGA.OutboundLink>
        ) : (
          <>
            <SkeletonTitle />
            <SkeletonText />
          </>
        )}
      </Background>
    </Grid>
  )
}

export default ModuleSmallCourseCard
