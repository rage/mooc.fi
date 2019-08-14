import React from "react"
import { Grid, Typography, ButtonBase, Badge } from "@material-ui/core"
import styled from "styled-components"
import { ObjectifiedModuleCourse } from "../../static/types/moduleTypes"
import { CourseStatus } from "/static/types/globalTypes"
import NextI18Next from "/i18n"

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

const Background = styled(ButtonBase)<{ upcoming?: boolean }>`
  background-color: white;
  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  height: 100%;
  width: 350px;
  padding: 1rem 1rem 2rem 1rem;
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
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 100%;
  }
`

function ModuleSmallCourseCard({
  course,
}: {
  course: ObjectifiedModuleCourse
}) {
  const { t } = NextI18Next.useTranslation("home")

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Background focusRipple>
        <a
          href={course.link}
          style={{ textDecoration: "none" }}
          onClick={e => (course.link === "" ? e.preventDefault() : null)}
          aria-label={`To the course homepage of ${course.name}`}
        >
          <CourseTitle component="h3" align="center" variant="h3">
            {course.name}
          </CourseTitle>
          <CourseText component="p" paragraph variant="body1" align="left">
            {course.description}
          </CourseText>
          {course.status === CourseStatus.Upcoming ? (
            <div
              style={{ position: "absolute", bottom: "20px", right: "40px" }}
            >
              <Badge badgeContent={t("upcomingShort")} color="primary">
                {" "}
              </Badge>
            </div>
          ) : null}
        </a>
      </Background>
    </Grid>
  )
}

export default ModuleSmallCourseCard
