import { EnhancedButtonBase, Grid, Skeleton, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import {
  ModuleCardText,
  ModuleCardTitle,
} from "/components/Home/ModuleDisplay/Common"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

import { CourseFieldsFragment, CourseStatus } from "/graphql/generated"

const SkeletonTitle = styled(Skeleton)`
  margin-bottom: 0.5rem;
`

const SkeletonText = styled(Skeleton)`
  margin-bottom: 1rem;
`

interface BackgroundProps {
  upcoming?: boolean
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
      ? css`
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
` as EnhancedButtonBase<"button", BackgroundProps>

const ContentArea = styled("div")`
  padding: 1rem 1rem 2rem 1rem;
  flex-direction: column;
  display: flex;
  flex: 1;
`

interface HeaderProps {
  startPoint?: boolean | null
  upcoming?: boolean | null
}

const Header = styled("div", {
  shouldForwardProp: (prop) => prop !== "startPoint" && prop !== "upcoming",
})<HeaderProps>`
  padding-top: 0.5rem;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding-bottom: 0.5rem;
  justify-content: center;
  color: #ffffff;
  background-color: ${({ startPoint, upcoming }) =>
    upcoming ? "#378170" : startPoint ? "#005A84" : "#158278"};
  width: 100%;
  display: flex;
`

interface ModuleSmallCourseCardProps {
  course?: CourseFieldsFragment
  showHeader?: boolean
}

function ModuleSmallCourseCard({
  course,
  showHeader,
}: ModuleSmallCourseCardProps) {
  const t = useTranslator(HomeTranslations)

  return (
    <Grid item xs={12} sm={6} md={12} lg={6} xl={4}>
      {course ? (
        <Background
          focusRipple
          href={course.link ?? ""}
          target="_blank"
          aria-label={`To the course homepage of ${course.name}`}
        >
          {showHeader &&
            (course.study_module_start_point ||
              course.status === CourseStatus.Upcoming) && (
              <Header
                startPoint={course.study_module_start_point}
                upcoming={course.status === CourseStatus.Upcoming}
              >
                <Typography variant="body1">
                  {course.status === CourseStatus.Upcoming
                    ? t("upcomingShort")
                    : t("moduleCourseStartPoint")}
                </Typography>
              </Header>
            )}
          <ContentArea>
            <ModuleCardTitle>{course.name}</ModuleCardTitle>
            <ModuleCardText>{course.description}</ModuleCardText>
          </ContentArea>
        </Background>
      ) : (
        <Background focusRipple component="div" role="none">
          <SkeletonTitle />
          <SkeletonText />
        </Background>
      )}
    </Grid>
  )
}

export default ModuleSmallCourseCard
