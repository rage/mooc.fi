import React from "react"

import Image from "next/image"

import { PropsOf } from "@emotion/react"
import CircleIcon from "@mui/icons-material/Circle"
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
import HelpIcon from "@mui/icons-material/Help"
import { Chip, Skeleton, Tooltip, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CardTitle } from "../Common/Card"
import OutboundLink from "/components/OutboundLink"
import { useTranslator } from "/hooks/useTranslator"
import moocLogo from "/public/images/new/logos/moocfi_white.svg"
//import sponsorLogo from "/public/images/new/components/courses/f-secure_logo.png"
import newTheme from "/src/newTheme"
import CommonTranslations from "/translations/common"
import { formatDateTime } from "/util/dataFormatFunctions"

import { CourseFieldsFragment } from "/graphql/generated"

const colorSchemes: Record<string, string> = {
  "Cyber Security Base": newTheme.palette.blue.dark2!,
  Ohjelmointi: newTheme.palette.green.dark2!,
  "Pilvipohjaiset websovellukset": newTheme.palette.crimson.dark2!,
  "Tekoäly ja data": newTheme.palette.purple.dark2!,
  other: newTheme.palette.gray.dark1!,
  difficulty: newTheme.palette.blue.dark1!,
  module: newTheme.palette.purple.dark1!,
  language: newTheme.palette.green.dark1!,
}

const ContainerBase = css`
  display: grid;
  grid-template-rows: 80px auto;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  max-height: 480px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`

const Container = styled("li", {
  shouldForwardProp: (prop) => prop !== "studyModule",
})<{ studyModule?: string }>(
  ({ theme, studyModule }) => `
  ${ContainerBase.styles}
  background-color: ${
    studyModule ? colorSchemes[studyModule] : colorSchemes["other"]
  };
  height: 100%;

  ${theme.breakpoints.down("sm")} {
    max-height: 600px;
  }
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
  display: flex;
`
/*  ${theme.breakpoints.down("md")} {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 1fr auto auto auto 1fr;
    grid-template-areas: 
      "description description description"
      "schedule details details"
      "languageTags languageTags languageTags"
      "difficultyTags difficultyTags difficultyTags"
      "moduleTags moduleTags moduleTags"
      ". . link";
  }
*/

const ContentContainer = styled("div")(
  ({ theme }) => `
  display: grid;
  padding: 0.5rem 1.5rem;
  grid-template-columns: 2fr 1fr max-content 2fr max-content;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  z-index: 1;
  border-radius: 0 0 0.5rem 0.5rem;
  grid-template-rows: 4fr auto auto 1fr;
  gap: 0.5rem;
  height: 100%;

  grid-template-areas:
    "description description description description details"
    "schedule schedule schedule languageTags languageTags"
    "moduleTags moduleTags difficultyTags difficultyTags difficultyTags"
    ". . . . link";

   ${theme.breakpoints.down("sm")} {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    overflow: wrap;
    grid-template-rows: auto auto auto auto auto 1fr 1fr;
    grid-template-areas:
      "description"
      "schedule"
      "details"
      "languageTags"
      "difficultyTags"
      "moduleTags"
      "link";
   }
`,
)

const Title = styled(CardTitle)(
  ({ theme }) => `
  font-weight: bold;
  color: white;
  text-align: left;
  border-radius: 0.2rem;
  align-self: center;
  width: 70%;
  padding-left: 1.5rem;
 
  ${theme.breakpoints.down("sm")} {
    width: 80%;
    font-size: 90%;
  }
`,
) as typeof CardTitle

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

const Description = styled("div")(
  ({ theme }) => `
  padding: 1rem 0;
  grid-area: description;

  ${theme.breakpoints.down("sm")} {
    margin-bottom: 1rem;
  }
`,
)

const Schedule = styled("div")`
  grid-area: schedule;
  display: flex;
  align-items: center;
`

const Details = styled("div")(
  ({ theme }) => `
  grid-area: details;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 1rem;

  ${theme.breakpoints.down("sm")} {
    align-items: center;
    flex-direction: row;
    margin-top: 0;

    & > div {
      :after {
        margin: 0 0.5rem;
        content: "|";
      }
  }
`,
)

const CourseLength = styled("div")`
  display: flex;
  align-items: center;
`

const Organizer = styled(Typography)`
  text-align: right;
`

const StyledTooltip = styled(Tooltip)`
  max-height: 1rem;
  margin-right: -0.5rem;

  &:hover {
    cursor: help;
  }
`

const Link = styled(OutboundLink)`
  justify-self: right;
  margin-bottom: 0;
` as typeof OutboundLink

const Tags = styled("div")`
  margin: auto 0;
  padding: 0;
  gap: 0.2rem;
`

const LanguageTags = styled(Tags)(
  ({ theme }) => `
  grid-area: languageTags;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-flow: wrap;

  ${theme.breakpoints.down("sm")} {
    justify-content: flex-start;
  }
`,
)

const DifficultyTags = styled(Tags)(
  ({ theme }) => `
  grid-area: difficultyTags;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-flow: wrap;
  margin: 0 0 auto;

  ${theme.breakpoints.down("sm")} {
    justify-content: flex-start;
  }
`,
)

const ModuleTags = styled(Tags)`
  grid-area: moduleTags;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-flow: wrap;
  margin: 0 0 auto;
`

const LinkArea = styled("div")`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  grid-area: link;
  height: fit-content;
`

const Tag = styled(Chip)`
  border-radius: 2rem;
  background-color: ${colorSchemes["other"]} !important;
  border-color: ${colorSchemes["other"]} !important;
  color: #fff !important;
  font-weight: bold;
  text-transform: uppercase;
`

const LanguageTag = styled(Tag)`
  background-color: ${colorSchemes["language"]} !important;
  border-color: ${colorSchemes["language"]} !important;
  border-radius: 3rem;
  min-width: 40px;
  max-height: 40px;
`

const DifficultyTagBase = styled(Tag)`
  background-color: ${colorSchemes["difficulty"]} !important;
  border-color: ${colorSchemes["difficulty"]} !important;
`

const DifficultyTag = ({
  difficulty,
  ...props
}: PropsOf<typeof Tag> & { difficulty: string }) => (
  <DifficultyTagContainer>
    <DifficultyTagBase {...props}></DifficultyTagBase>
    <CircleContainer>
      <StyledCircleIcon />
      {difficulty !== "beginner" ? (
        <StyledCircleIcon />
      ) : (
        <StyledCircleOutlinedIcon />
      )}
      {difficulty === "advanced" ? (
        <StyledCircleIcon />
      ) : (
        <StyledCircleOutlinedIcon />
      )}
    </CircleContainer>
  </DifficultyTagContainer>
)

const DifficultyTagContainer = styled("div")`
  display: inline-block;
  text-align: center;
`

const ModuleTag = styled(Tag)`
  background-color: ${colorSchemes["module"]} !important;
  border-color: ${colorSchemes["module"]} !important;
`

const CircleContainer = styled("div")(
  ({ theme }) => `
  ${theme.breakpoints.down("sm")} {
    display: none;
  }
`,
)

const StyledCircleIcon = styled(CircleIcon)`
  max-width: 15px;
`

const StyledCircleOutlinedIcon = styled(CircleOutlinedIcon)`
  max-width: 15px;
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
  z-index: -1;
`

const prettifyDate = (date: string) =>
  date.split("T").shift()?.split("-").reverse().join(".")

const allowedLanguages = ["en", "fi", "se", "other_language"]

interface CourseCardLayoutProps {
  title: string | React.ReactNode
  description: string | React.ReactNode
  schedule: string | React.ReactNode
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
        <MoocfiLogo
          alt="MOOC logo"
          src={moocLogo}
          width={105}
          height={95}
          priority
        />
      </TitleContainer>
      <ContentContainer>
        <Description>
          <Typography variant="body1">{description}</Typography>
        </Description>
        <Schedule>{schedule}</Schedule>
        <ModuleTags>{moduleTags}</ModuleTags>
        <Details>
          {details}
          <Organizer variant="body2">{organizer}</Organizer>
        </Details>
        <LanguageTags>{languageTags}</LanguageTags>
        <DifficultyTags>{difficultyTags}</DifficultyTags>
        <LinkArea>{link}</LinkArea>
      </ContentContainer>
    </>
  )
}

interface CourseScheduleProps {
  status: CourseFieldsFragment["status"]
  startDate: CourseFieldsFragment["start_date"]
  endDate: CourseFieldsFragment["end_date"]
}

function CourseSchedule({ status, startDate, endDate }: CourseScheduleProps) {
  const t = useTranslator(CommonTranslations)

  if (status == "Upcoming") {
    return (
      <Typography variant="body2">
        {t("Upcoming")} {startDate && prettifyDate(startDate)}
      </Typography>
    )
  } else if (status == "Ended") {
    return (
      <Typography variant="body2">
        {t("Ended")}{" "}
        {endDate && Date.parse(endDate) < Date.now() && formatDateTime(endDate)}
      </Typography>
    )
  }

  return (
    <Typography variant="body2">
      {t("Active")}{" "}
      {endDate ? (
        <>
          {formatDateTime(startDate)} - {formatDateTime(endDate)}
        </>
      ) : (
        <>— {t("unscheduled")}</>
      )}
    </Typography>
  )
}

interface CourseCardProps {
  course: CourseFieldsFragment
  tags?: string[]
}

const CourseCard = React.forwardRef<HTMLLIElement, CourseCardProps>(
  ({ course }, ref) => {
    const t = useTranslator(CommonTranslations)

    return (
      <Container
        ref={ref}
        studyModule={
          course.study_modules.length == 0
            ? "other"
            : course.study_modules[0].name
        }
      >
        <CourseCardLayout
          title={course?.name}
          description={course?.description}
          schedule={
            <CourseSchedule
              status={course.status}
              startDate={course.start_date}
              endDate={course.end_date}
            />
          }
          moduleTags={course?.tags
            ?.filter((t) => t.types?.includes("module") && t.name)
            .map((tag) => (
              <ModuleTag
                key={tag.id}
                size="small"
                variant="filled"
                label={tag.name}
              />
            ))}
          details={
            course.ects && (
              <CourseLength>
                <Typography variant="body2">
                  {course.ects} op | ~
                  {Math.round((parseInt(course.ects) * 27) / 5) * 5}h
                </Typography>
                <StyledTooltip
                  title={
                    t("ectsHoursExplanation1") +
                    ` ${course.ects} ` +
                    t("ectsHoursExplanation2")
                  }
                >
                  <HelpIcon />
                </StyledTooltip>
              </CourseLength>
            )
          }
          /* TODO: add information regarding university/organization to course */
          organizer="Helsingin yliopisto"
          languageTags={course?.tags
            ?.filter((t) => t.types?.includes("language"))
            .filter((t) => allowedLanguages.includes(t.id))
            .map((tag) => (
              <LanguageTag
                key={tag.id}
                size="small"
                variant="filled"
                label={tag.name?.toUpperCase()}
              />
            ))}
          difficultyTags={course?.tags
            ?.filter((t) => t.types?.includes("difficulty"))
            .map((tag) => (
              <DifficultyTag
                key={tag.id}
                size="small"
                variant="filled"
                label={tag.name}
                difficulty={tag.id}
              />
            ))}
          link={<Link href="https://www.mooc.fi">{t("showCourse")}</Link>}
          /* <SponsorContainer>
          <Sponsor src={sponsorLogo.src} alt="Sponsor logo" fill />
        </SponsorContainer> */
        />
      </Container>
    )
  },
)

export const CourseCardSkeleton = () => (
  <SkeletonContainer>
    <CourseCardLayout
      title={<Skeleton width={200} />}
      description={
        <>
          <Skeleton width="100%" />
          <Skeleton width="100%" />
          <Skeleton width="35%" />
        </>
      }
      schedule={<Skeleton />}
      details={<Skeleton width={75} />}
      organizer={<Skeleton width={75} />}
      moduleTags={<Skeleton width={60} />}
      languageTags={<Skeleton width={45} />}
      difficultyTags={<Skeleton width={65} height={50} />}
      link={<Skeleton width="100%" />}
    />
  </SkeletonContainer>
)

export default CourseCard
