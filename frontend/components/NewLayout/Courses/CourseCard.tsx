import React, { useMemo } from "react"

import Image from "next/image"

import { PropsOf } from "@emotion/react"
import CircleIcon from "@mui/icons-material/Circle"
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
import HelpIcon from "@mui/icons-material/Help"
import { Chip, Skeleton, Tooltip, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CardTitle } from "../Common/Card"
import OutboundLink from "/components/OutboundLink"
import { CardSubtitle } from "/components/Text/headers"
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
  max-width: 800px;
  margin: 1rem auto;
  width: 100%;
`

const Container = styled("li", {
  shouldForwardProp: (prop) => prop !== "studyModule",
})<{ studyModule?: string }>(
  ({ studyModule }) => `
  ${ContainerBase.styles}
  background-color: ${
    studyModule ? colorSchemes[studyModule] : colorSchemes["other"]
  };
  height: 100%;
  container-type: inline-size;
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

const Schedule = styled(Typography)`
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
`

const Link = styled(OutboundLink)`
  justify-self: right;
  margin-bottom: 0;
` as typeof OutboundLink

const Tags = styled("div")`
  display: flex;
  flex-shrink: 1;
  margin-bottom: auto;
  padding: 0;
  gap: 0.2rem;
  justify-content: flex-end;
`

const LanguageTags = styled(Tags)`
  grid-area: languageTags;
  display: flex;
  margin: 0 0 auto;
  flex-shrink: 1;
`

const DifficultyTags = styled(Tags)`
  grid-area: difficultyTags;
  display: flex;
  margin: 0 0 auto;
  flex-shrink: 1;
  justify-content: flex-start;
`

const ModuleTags = styled(Tags)`
  grid-area: moduleTags;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-flow: wrap;
  margin: 0 auto;
  flex-grow: 2;
  flex-shrink: 0;
  flex-basis: 50%;
`

const LinkArea = styled("div")`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  grid-area: link;
  margin-left: auto;
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

const DifficultyTagContainer = styled("div")`
  display: flex;
  flex-direction: column;
  text-align: center;
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
  z-index: 0;
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
        {typeof schedule === "string" ? (
          <Schedule
            variant="body2"
            component="div"
            dangerouslySetInnerHTML={{ __html: schedule }}
          />
        ) : (
          schedule
        )}
        <ResponsiveTags>
          <LanguageTags>{languageTags}</LanguageTags>
          <DifficultyTags>{difficultyTags}</DifficultyTags>
        </ResponsiveTags>
        <ModuleTags>{moduleTags}</ModuleTags>
        <LinkArea>{link}</LinkArea>
      </ContentContainer>
    </>
  )
}

interface CourseCardProps {
  course: CourseFieldsFragment
  tags?: string[]
}

const CourseCard = React.forwardRef<HTMLLIElement, CourseCardProps>(
  ({ course, ...props }, ref) => {
    const t = useTranslator(CommonTranslations)

    const schedule = useMemo(() => {
      const { status, start_date, end_date } = course
      if (status == "Upcoming") {
        return `${t("Upcoming")}${
          start_date ? "&nbsp;" + prettifyDate(start_date) : ""
        }`
      } else if (status == "Ended") {
        return `${t("Ended")}${
          end_date && Date.parse(end_date) < Date.now()
            ? "&nbsp;" + formatDateTime(end_date)
            : ""
        }`
      } else {
        return `${t("Active")}&nbsp;${
          end_date
            ? formatDateTime(start_date) +
              "&nbsp;-&nbsp;" +
              formatDateTime(end_date)
            : "—&nbsp;" + t("unscheduled")
        }`
      }
    }, [course, t])

    return (
      <Container
        ref={ref}
        studyModule={
          course.study_modules.length == 0
            ? "other"
            : course.study_modules[0].name
        }
        {...props}
      >
        <CourseCardLayout
          title={course?.name}
          description={course?.description}
          schedule={schedule}
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
                  {course.ects}&nbsp;op&nbsp;|&nbsp;~
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
          <Skeleton variant="text" width={300} />
          <Skeleton width="100%" />
          <Skeleton width="35%" />
        </>
      }
      schedule={<Skeleton width={200} height={20} />}
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
