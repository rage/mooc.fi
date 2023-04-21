import { Chip, Grid, Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

import CourseImage from "/components/CourseImage"
import { CourseImageBase } from "/components/Images/CardBackgroundFullCover"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { CardTitle } from "/components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

import { FrontpageCourseFieldsFragment } from "/graphql/generated"

const Background = styled(ClickableButtonBase)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  @media (min-width: 430px) and (max-width: 959px) {
    flex-direction: row;
  }
` as typeof ClickableButtonBase

const ResponsiveCourseImageBase = styled(CourseImageBase)`
  position: relative;
  width: 100%;
  height: 230px;
  min-height: 230px;
  @media (min-width: 430px) and (max-width: 600px) {
    width: 45%;
    height: 100%;
  }
  @media (min-width: 600px) and (max-width: 959px) {
    width: 40%;
    height: 100%;
  }
`

const TextArea = styled("div")`
  padding: 1rem 1rem 2rem 1rem;
  height: 100%;
  color: black;
  width: 100%;
  min-height: 230px;
  @media (min-width: 430px) and (max-width: 600px) {
    text-align: left;
    width: 65%;
  }
  @media (min-width: 600px) and (max-width: 959px) {
    text-align: left;
    width: 60%;
  }
`

interface CourseCardProps {
  course?: FrontpageCourseFieldsFragment
}

function CourseCard({ course }: CourseCardProps) {
  const t = useTranslator(HomeTranslations)

  return (
    <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
      <Background
        focusRipple
        href={course?.link ?? ""}
        target="_blank"
        disabled={
          !course?.link ||
          (course?.status === "Upcoming" && !course?.upcoming_active_link)
        }
      >
        <ResponsiveCourseImageBase>
          {course ? (
            <CourseImage
              photo={course.photo}
              alt={course.name}
              style={{ opacity: course.status === "Upcoming" ? 0.6 : 1 }}
            />
          ) : (
            <Skeleton variant="rectangular" height="100%" />
          )}
          {course?.link &&
            course?.status === "Upcoming" &&
            course?.upcoming_active_link && (
              <Chip
                variant="outlined"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "white",
                }}
                clickable
                label={t("coursePageAvailable")}
              />
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
    </Grid>
  )
}

export default CourseCard
