import React from "react"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import ReactGA from "react-ga"
import CourseImage from "../CourseImage"

const Background = styled(ButtonBase)`
  background-color: white;
  position: relative;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  height: 100%;
  width: 350px;
  @media (max-width: 600px) {
    width: 100%;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 500px;
  }
`

const TextArea = styled.div`
  padding: 1rem 1rem 2rem 1rem;
  height: 200px;
  color: black;
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

const ImageArea = styled.div`
  height: 200px;
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
const CardLinkWithGA = styled(ReactGA.OutboundLink)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  @media (max-width: 960px) {
    flex-direction: row;
  }
`
interface Image {
  id: any
  name: string | null
  original: string
  original_mimetype: string
  compressed: string
  compressed_mimetype: string
  uncompressed: string
  uncompressed_mimetype: string
  encoding: string | null
  default: boolean | null
}

type FilteredCourse = {
  name: string
  description: string
  id: string
  link: string
  photo: Image
  promote: boolean
  slug: string
  start_point: boolean
  status: string
}

interface CourseCardProps {
  course: FilteredCourse
}

function CourseCard(props: CourseCardProps) {
  const { course } = props
  return (
    <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
      <Background focusRipple disabled={course.status === "Upcoming"}>
        <CardLinkWithGA
          eventLabel={`coursesite: ${course.name}`}
          to={course.link}
          target="_blank"
        >
          <ImageArea>
            <CourseImage
              photo={course.photo}
              style={{ opacity: course.status === "Upcoming" ? 0.6 : 1 }}
            />
          </ImageArea>
          <TextArea>
            <Typography component="h3" variant="h3" gutterBottom={true}>
              {course.name}
            </Typography>
            <Typography component="p" variant="body1" paragraph align="left">
              {course.description}
            </Typography>
          </TextArea>
        </CardLinkWithGA>
      </Background>
    </Grid>
  )
}

export default CourseCard
