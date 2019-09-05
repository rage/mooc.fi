import React, { useContext } from "react"
import { Grid, Typography, ButtonBase, Badge } from "@material-ui/core"
import styled from "styled-components"
import { CourseStatus } from "/static/types/globalTypes"
import LanguageContext from "/contexes/LanguageContext"
import getHomeTranslator from "/translations/home"
import { AllCourses_courses } from "/static/types/generated/AllCourses"
import Skeleton from "@material-ui/lab/Skeleton"
import ReactGA from "react-ga"

const CourseTitle = styled(Typography)`
  margin-bottom: 0.5rem;
  // font-size: 22px;
  @media (min-width: 425px) {
    // font-size: 32px;
  }
  color: black;
`
const CourseText = styled(Typography)`
  margin-bottom: 1rem;
  // font-size: 16px;
  @media (min-width: 425px) {
    // font-size: 18px;
  }
  color: black;
`

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

const Background = styled(ButtonBase)<BackgroundProps>`
  background-color: white;
  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  @media (max-width: 960px) {
    width: 100%;
    min-height: 150px;
    justify-content: flex-start;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 100%;
    min-height: 250px;
    justify-content: flex-start;
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
}

const Header = styled.div<HeaderProps>`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  justify-content: center;
  top: 0;
  left: 0;
  color: #ffffff;
  background-color: ${({ startPoint }) => (startPoint ? "#31a3e8" : "#158278")};
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
  const lng = useContext(LanguageContext)
  const t = getHomeTranslator(lng.language)

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Background focusRipple component="div">
        {course ? (
          <ReactGA.OutboundLink
            eventLabel={`modulecoursesite: ${course ? course.name : ""}`}
            to={course.link}
            target="_blank"
            style={{ textDecoration: "none", width: "100%" }}
            onClick={e => (course.link === "" ? e.preventDefault() : null)}
            aria-label={`To the course homepage of ${course.name}`}
          >
            {showHeader ? (
              <Header startPoint={course!.study_module_start_point}>
                <Typography variant="body1">
                  {course!.study_module_start_point
                    ? t("moduleCourseBeginner")
                    : t("moduleCourseIntermediate")}
                </Typography>
              </Header>
            ) : null}
            <ContentArea>
              <CourseTitle component="h3" align="center" variant="h3">
                {course.name}
              </CourseTitle>
              <CourseText component="p" paragraph variant="body1" align="left">
                {course.description}
              </CourseText>
              {course.status === CourseStatus.Upcoming ? (
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "40px",
                  }}
                >
                  <Badge badgeContent={t("upcomingShort")} color="primary">
                    {" "}
                  </Badge>
                </div>
              ) : null}
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
