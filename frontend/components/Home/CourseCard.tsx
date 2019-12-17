import React from "react"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import ReactGA from "react-ga"
import CourseImage from "/components/CourseImage"
import Skeleton from "@material-ui/lab/Skeleton"
import { AllCourses_courses } from "/static/types/generated/AllCourses"
import { CardTitle } from "/components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { CourseImageBase } from "/components/Images/CardBackgroundFullCover"

const Background = styled(ClickableButtonBase)<{ component: any }>`
  display: flex;
  flex-direction: column;
  @media (max-width: 960px) {
    flex-direction: row;
  }
`

const ResponsiveCourseImageBase = styled(CourseImageBase)`
  @media (max-width: 430px) {
    height: 235px;
    width: 30%;
  }
  @media (min-width: 430px) and (max-width: 600px) {
    width: 45%;
    height: 215px;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 40%;
    height: 240px;
  }
`

const TextArea = styled.div`
  padding: 1rem 1rem 2rem 1rem;
  height: 230px;
  color: black;
  width: 100%;
  @media (max-width: 430px) {
    width: 70%;
    text-align: left;
  }
  @media (min-width: 430px) and (max-width: 600px) {
    text-align: left;
    width: 65%;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    text-align: left;
    width: 60%;
  }
`

const CardLinkWithGA = styled(ReactGA.OutboundLink)`
  text-decoration: none;
`
interface CourseCardProps {
  course?: AllCourses_courses
}

const CourseCard = ({ course }: CourseCardProps) => (
  <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
    <CardLinkWithGA
      eventLabel={`coursesite: ${course?.name ?? ""}`}
      to={course ? course.link || "" : ""}
      target="_blank"
    >
      <Background
        focusRipple
        disabled={!course || (!course.link || course.link === "")}
        component="div"
      >
        <ResponsiveCourseImageBase>
          {course ? (
            <CourseImage
              photo={course.photo}
              style={{ opacity: course.status === "Upcoming" ? 0.6 : 1 }}
            />
          ) : (
            <Skeleton variant="rect" height="100%" />
          )}
        </ResponsiveCourseImageBase>
        <TextArea>
          {course ? (
            <>
              <CardTitle component="h3" variant="h3">
                {course.name}
              </CardTitle>
              <CardText component="p" variant="body1" paragraph align="left">
                {course.description}
              </CardText>
            </>
          ) : (
            <>
              <h3>
                <Skeleton variant="text" width="100%" />
              </h3>
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
            </>
          )}
        </TextArea>
      </Background>
    </CardLinkWithGA>
  </Grid>
)

export default CourseCard
