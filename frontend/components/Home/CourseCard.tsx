import React from "react"
import styled from "styled-components"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import ReactGA from "react-ga"

const CourseImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

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
  padding: 1rem;
  height: 180px;
  color: black;
  @media (max-width: 600px) {
    height: 100%;
    width: 80%;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    height: 100%;
    width: 60%;
  }
`
const ImageArea = styled.div`
  height: 250px;
  @media (max-width: 430px) {
    height: 295px;
    width: 20%;
  }
  @media (min-width: 430px) and (max-width: 600px) {
    width: 30%;
  }
  @media (min-width: 600px) and (max-width: 960px) {
    width: 40%;
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
interface ImageProps {
  photo: any[]
  isUpcoming: boolean
}
function ImageInWebp(props: ImageProps) {
  const { photo, isUpcoming } = props

  return (
    <picture>
      <source srcSet={photo[0]} type="image/webp" />
      <source srcSet={photo[1]} type="image/png" />
      <CourseImage
        src={photo[1]}
        alt=""
        style={{ opacity: isUpcoming ? 0.6 : 1 }}
      />
    </picture>
  )
}

type FilteredCourse = {
  name: string
  description: string
  id: string
  link: string
  photo: any[]
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
            <ImageInWebp
              photo={course.photo}
              isUpcoming={course.status === "Upcoming"}
            />
          </ImageArea>
          <TextArea>
            <Typography component="h3" variant="h6" gutterBottom={true}>
              {course.name}
            </Typography>
            <Typography component="p" paragraph align="left">
              {course.description}
            </Typography>
          </TextArea>
        </CardLinkWithGA>
      </Background>
    </Grid>
  )
}

export default CourseCard
