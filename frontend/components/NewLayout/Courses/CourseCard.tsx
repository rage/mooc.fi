import React from "react"

import Image from "next/image"

import { PropsOf } from "@emotion/react"
import HelpIcon from "@mui/icons-material/Help"
import { Skeleton, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CardTitle } from "../Common/Card"
import { courseColorSchemes } from "./common"
import {
  DifficultyTags,
  DifficultyTagsContainer,
  LanguageTags,
  LanguageTagsContainer,
  ModuleTags,
  ModuleTagsContainer,
} from "./Tags"
import OutboundLink from "/components/OutboundLink"
import { CardSubtitle } from "/components/Text/headers"
import Tooltip from "/components/Tooltip"
import { useTranslator } from "/hooks/useTranslator"
import moocLogo from "/public/images/new/logos/moocfi_white.svg"
//import sponsorLogo from "/public/images/new/components/courses/f-secure_logo.png"
import CommonTranslations from "/translations/common"
import { useFormatDateTime } from "/util/dataFormatFunctions"

import { CourseStatus, NewCourseFieldsFragment } from "/graphql/generated"

const ContainerBase = css`
  display: grid;
  grid-template-rows: 80px auto;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  max-width: 800px;
  margin: 1rem auto;
  width: 100%;
`

const Container = styled("li", {
  shouldForwardProp: (prop) => prop !== "studyModule" && prop !== "ended",
})<{ studyModule?: string; ended?: boolean }>(
  ({ studyModule, ended }) => `
  ${ContainerBase.styles}
  background-color: ${
    studyModule ? courseColorSchemes[studyModule] : courseColorSchemes["other"]
  };
  height: 100%;
  container-type: inline-size;
  ${ended ? "filter: grayscale(60%) opacity(0.8);" : ""}
`,
)

const SkeletonContainer = styled("li")`
  ${ContainerBase.styles};
  width: 100%;
  background-color: #eee;
`

const TitleContainer = styled("div")`
  position: relative;
  max-height: 80px;
  height: 80px;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1rem;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  z-index: 1;
  border-radius: 0 0 0.5rem 0.5rem;
  gap: 0.5rem;
  height: 100%;
  justify-content: space-between;
`

const Title = styled(CardTitle)(
  ({ theme }) => `
  font-weight: bold;
  color: white;
  text-align: left;
  border-radius: 0.2rem;
  width: 70%;
  padding-left: 1.5rem;

  ${theme.breakpoints.down("sm")} {
    width: 80%;
    font-size: 90%;
  }
`,
) as typeof CardTitle

// @ts-ignore: not used
const TitleSchedule = styled(CardSubtitle)`
  color: white;
  margin: 0;
  padding-left: 1.5rem;
` as typeof CardSubtitle

/* const SponsorContainer = styled("div")`
  display: flex;
  justify-content: flex-end;
  position: relative;
  height: 100%;
  width: 100%;
` */

/* const Sponsor = styled(Image)`
  object-fit: contain;
  max-width: 9rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 1);
  padding: 1rem;
  justify-self: right;
` */

const Description = styled("div")`
  padding: 0 0.5rem 1.5rem 0;
  margin: 0 0 auto;
  flex-grow: 1;
  display: flex;
  min-width: 200px;
  min-height: 100px;
`

const MainContent = styled("div")`
  display: flex;
  flex-direction: column;
  margin: auto;
  height: 50%;
  flex-grow: 2;
  flex-shrink: 1;
  width: 400px;
`

const ScheduleContainer = styled(Typography)`
  grid-area: schedule;
  display: flex;
  align-items: flex-start;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30%;
  margin: 0;

  @container (max-width: calc(560px + 4rem)) {
    justify-content: flex-end;
    flex-grow: 0;
  }
` as typeof Typography

const CourseDetails = styled("div")`
  grid-area: details;
  display: flex;
  flex-shrink: 1;
  flex-grow: 0;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-end;
  align-content: flex-start;
  overflow: hidden;
  flex-basis: 160px;

  @container (min-width: calc(560px + 4rem)) {
    & > div {
      padding: 0 1rem;
      margin-right: -1rem;
      position: relative;
      z-index: 0;
      overflow: hidden;
      :before {
        content: "|";
        position: absolute;
        right: calc(0.25rem + 2px);
        bottom: 0;
      }
    }
  }

  @container (max-width: calc(560px + 4rem)) {
    justify-content: flex-start;
    flex-basis: max-content;

    & > div {
      padding: 0 1rem 0 1rem;
      margin-left: -1rem;
      margin-right: 0rem;
      position: relative;
      z-index: 0;
      overflow: hidden;
      :before {
        content: "|";
        position: absolute;
        left: calc(0.5rem - 2px);
        bottom: 0;
      }
    }
  }
`

const ResponsiveTags = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 50%;
`

const CourseLength = styled("div")`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`

const Organizer = styled(Typography)`
  display: flex;
  align-items: center;
  margin: 0;
  text-align: right;
` as typeof Typography

const StyledTooltip = styled(Tooltip)`
  max-height: 1rem;
  margin-right: -0.25rem;

  &:hover {
    cursor: help;
  }
` as typeof Tooltip

const StyledHelpIcon = styled(HelpIcon)`
  margin-left: 0.25rem;
  font-size: inherit;
  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: help;
    scale: 1.2;
  }
`

const Link = styled(OutboundLink)`
  justify-self: right;
  margin-bottom: 0;
` as typeof OutboundLink

const LinkArea = styled("div")`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  grid-area: link;
  margin-left: auto;
  height: fit-content;
`

const CardHeaderImage = styled(Image)`
  object-fit: cover;
  opacity: 0.4;
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 35%;
  height: auto;
  z-index: 0;
  overflow: hidden;
`

const MoocfiLogo = styled(CardHeaderImage)`
  z-index: 0;
`

interface ScheduleProps {
  course?: NewCourseFieldsFragment
}

const Schedule = React.memo(
  ({ course, children }: React.PropsWithChildren<ScheduleProps>) => {
    const t = useTranslator(CommonTranslations)
    const formatLocaleDateTime = useFormatDateTime()

    let schedule: string | undefined

    if (course) {
      const { status, start_date, end_date } = course
      if (status === CourseStatus.Upcoming) {
        schedule = `${t("Upcoming")}${
          start_date ? "&nbsp;" + formatLocaleDateTime(start_date) : ""
        }`
      } else if (status === CourseStatus.Ended) {
        schedule = `${t("Ended")}${
          end_date && Date.parse(end_date) < Date.now()
            ? "&nbsp;" + formatLocaleDateTime(end_date)
            : ""
        }`
      } else {
        schedule = `${t("Active")}&nbsp;${
          end_date
            ? formatLocaleDateTime(start_date) +
              "&nbsp;-&nbsp;" +
              formatLocaleDateTime(end_date)
            : "—&nbsp;" + t("unscheduled")
        }`
      }
    }

    return (
      <ScheduleContainer
        variant="body2"
        component="div"
        {...(schedule && { dangerouslySetInnerHTML: { __html: schedule } })}
      >
        {children}
      </ScheduleContainer>
    )
  },
  (prevProps, nextProps) => prevProps.course === nextProps.course,
)

interface CourseCardLayoutProps {
  title: string | React.ReactNode
  description: string | React.ReactNode
  schedule: React.ReactNode
  details: string | React.ReactNode
  organizer?: string | React.ReactNode
  moduleTags?: React.ReactNode
  languageTags?: React.ReactNode
  difficultyTags?: React.ReactNode
  link: React.ReactNode
}

function CourseCardLayout({
  title,
  description,
  schedule,
  details,
  organizer,
  moduleTags,
  languageTags,
  difficultyTags,
  link,
}: CourseCardLayoutProps) {
  return (
    <>
      <TitleContainer>
        <Title variant="h6" component="h3">
          {title}
        </Title>
        {/*typeof schedule === "string" && <TitleSchedule variant="caption" component="h4" dangerouslySetInnerHTML={{ __html: schedule }} />*/}
        <MoocfiLogo
          alt="MOOC logo"
          src={moocLogo}
          width={105}
          height={95}
          priority
        />
      </TitleContainer>
      <ContentContainer id="content-container">
        <MainContent>
          <Description>
            <Typography variant="body1">{description}</Typography>
          </Description>
        </MainContent>
        <CourseDetails>
          {details}
          <Organizer variant="body2" component="div">
            {organizer}
          </Organizer>
        </CourseDetails>{" "}
        {schedule}
        <ResponsiveTags>
          <LanguageTagsContainer>{languageTags}</LanguageTagsContainer>
          <DifficultyTagsContainer>{difficultyTags}</DifficultyTagsContainer>
        </ResponsiveTags>
        <ModuleTagsContainer>{moduleTags}</ModuleTagsContainer>
        <LinkArea>{link}</LinkArea>
      </ContentContainer>
    </>
  )
}

interface CourseCardProps {
  course: NewCourseFieldsFragment
  studyModule?: string
}

const CourseCard = React.forwardRef<
  HTMLLIElement,
  CourseCardProps & PropsOf<typeof Container>
>(({ course, studyModule, ...props }, ref) => {
  const t = useTranslator(CommonTranslations)

  const courseStudyModule =
    studyModule ?? course.study_modules[0]?.slug ?? "other"

  return (
    <Container
      ref={ref}
      studyModule={courseStudyModule}
      ended={course?.status === CourseStatus.Ended}
      {...props}
    >
      <CourseCardLayout
        title={course?.name}
        description={course?.description}
        schedule={<Schedule course={course} />}
        moduleTags={<ModuleTags course={course} />}
        details={
          course.ects && (
            <CourseLength>
              <Typography variant="body2">
                {course.ects}&nbsp;op&nbsp;|&nbsp;~
                {Math.round((parseInt(course.ects) * 27) / 5) * 5}h
              </Typography>
              <StyledTooltip
                title={`${t("ectsHoursExplanation1")} ${course.ects} ${t(
                  "ectsHoursExplanation2",
                )}`}
              >
                <StyledHelpIcon />
              </StyledTooltip>
            </CourseLength>
          )
        }
        /* TODO: add information regarding university/organization to course */
        organizer="Helsingin yliopisto"
        languageTags={<LanguageTags course={course} />}
        difficultyTags={<DifficultyTags course={course} />}
        link={<Link href="https://www.mooc.fi">{t("showCourse")}</Link>}
        /* <SponsorContainer>
          <Sponsor src={sponsorLogo.src} alt="Sponsor logo" fill />
        </SponsorContainer> */
      />
    </Container>
  )
})

export const CourseCardSkeleton = () => (
  <SkeletonContainer>
    <CourseCardLayout
      title={<Skeleton width={200} />}
      description={
        <>
          <Skeleton variant="text" width={300} />
          <Skeleton width="100%" />
          <Skeleton width="35%" />
        </>
      }
      schedule={
        <Schedule>
          <Skeleton width={200} height={20} />
        </Schedule>
      }
      details={<Skeleton width={180} height={20} />}
      organizer={<Skeleton width={100} height={20} />}
      moduleTags={<Skeleton width={140} height={30} />}
      languageTags={
        <Skeleton width={120} height={30} sx={{ marginTop: "0.5rem" }} />
      }
      difficultyTags={<Skeleton width={100} height={60} />}
      link={<Skeleton width={150} />}
    />
  </SkeletonContainer>
)

export default CourseCard
