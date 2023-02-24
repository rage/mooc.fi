import Image from "next/image"

import CircleIcon from "@mui/icons-material/Circle"
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined"
import HelpIcon from "@mui/icons-material/Help"
import { Button, Skeleton, Tooltip, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CardTitle } from "../Common/Card"
import OutboundLink from "/components/OutboundLink"
import moocLogo from "/public/images/moocfi_white.svg"
//import sponsorLogo from "/public/images/new/components/courses/f-secure_logo.png"
import newTheme from "/src/newTheme"
import CommonTranslations from "/translations/common"
import { formatDateTime } from "/util/dataFormatFunctions"
import { useTranslator } from "/util/useTranslator"

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
  grid-template-rows: 1fr 4fr;
  grid-template-columns: 1fr;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-radius: 0.5rem;
  max-height: 400px;
  max-width: 800px;
`

const Container = styled("li", {
  shouldForwardProp: (prop) => prop !== "module",
})<{ module?: string }>`
  ${ContainerBase};
  background-color: ${(props) =>
    props.module ? colorSchemes[props.module] : colorSchemes["other"]};
`

const SkeletonContainer = styled("li")`
  ${ContainerBase};
  width: 100%;
  background-color: #eee;
`

const TitleContainer = styled("div")`
  position: relative;
  min-height: 80px;
  height: 80px;
  padding: 1rem 2.5rem 1rem 1.5rem;
  display: flex;
`

const ContentContainer = styled("div")`
  display: grid;
  padding: 0.5rem 1.5rem 0.1rem 1.5rem;
  grid-template-columns: 2fr 1fr;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  z-index: 1;
  border-radius: 0 0 0.5rem 0.5rem;
`

const LeftContentContainer = styled("div")`
  display: grid;
  grid-template-rows: 3fr 1fr 1fr;
  justify-content: left;
`

const RightContentContainer = styled("div")`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  justify-content: right;
`

const Title = styled(CardTitle)`
  font-weight: bold;
  color: white;
  text-align: left;
  border-radius: 0.2rem;
  align-self: center;
  width: 70%;
` as typeof CardTitle

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
  padding: 1rem 0;
`

const Schedule = styled("div")``

const Details = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem;
`

const CourseLength = styled("div")`
  display: flex;
  align-items: center;
`

const StyledTooltip = styled(Tooltip)`
  max-height: 1rem;
`

const Link = styled(OutboundLink)`
  justify-self: right;
  margin: 1rem;
`

const Tags = styled("div")``

const LanguageTags = styled(Tags)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const DifficultyTags = styled(Tags)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModuleTags = styled(Tags)``

const Tag = styled(Button)`
  border-radius: 2rem;
  background-color: ${colorSchemes["other"]} !important;
  border-color: ${colorSchemes["other"]} !important;
  color: #fff !important;
  font-weight: bold;
  margin: 0 0.1rem;
`

const LanguageTag = styled(Tag)`
  background-color: ${colorSchemes["language"]} !important;
  border-color: ${colorSchemes["language"]} !important;
  border-radius: 3rem;
  padding: 0.5rem;
  min-width: 40px;
  max-height: 40px;
`

const DifficultyTag = styled(Tag)`
  background-color: ${colorSchemes["difficulty"]} !important;
  border-color: ${colorSchemes["difficulty"]} !important;
`

const DifficultyTagContainer = styled("div")`
  display: inline-block;
  text-align: center;
`

const ModuleTag = styled(Tag)`
  background-color: ${colorSchemes["module"]} !important;
  border-color: ${colorSchemes["module"]} !important;
`

const CircleContainer = styled("div")``

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
`

const MoocfiLogo = styled(CardHeaderImage)``

const prettifyDate = (date: string) =>
  date.split("T").shift()?.split("-").reverse().join(".")

interface CourseCardProps {
  course: CourseFieldsFragment
  tags?: string[]
}

function CourseCard({ course }: CourseCardProps) {
  const t = useTranslator(CommonTranslations)

  return (
    <Container
      module={
        course.study_modules.length == 0
          ? "other"
          : course.study_modules[0].name
      }
    >
      <TitleContainer>
        <Title variant="h6">{course?.name}</Title>
        <MoocfiLogo
          alt="MOOC logo"
          src={moocLogo.src}
          width={105}
          height={95}
        />
      </TitleContainer>
      <ContentContainer>
        <LeftContentContainer>
          <Description>
            <Typography variant="body1">{course?.description}</Typography>
          </Description>
          <Schedule>
            {course.status == "Upcoming" ? (
              <p>
                {t("Upcoming")}{" "}
                {course.start_date && prettifyDate(course.start_date)}
              </p>
            ) : course?.status == "Ended" ? (
              <p>
                {t("Ended")}{" "}
                {course.end_date &&
                  Date.parse(course.end_date) < Date.now() &&
                  formatDateTime(course.end_date)}
              </p>
            ) : (
              <p>
                {t("Active")}{" "}
                {course.end_date ? (
                  <>
                    {formatDateTime(course.start_date)} -{" "}
                    {formatDateTime(course.end_date)}
                  </>
                ) : (
                  <>— {t("unscheduled")}</>
                )}
              </p>
            )}
          </Schedule>
          <ModuleTags>
            {course?.tags
              ?.filter((t) => t.types?.includes("module"))
              .map((tag) => (
                <ModuleTag size="small" variant="contained" disabled>
                  {tag.id}
                </ModuleTag>
              ))}
          </ModuleTags>
        </LeftContentContainer>
        <RightContentContainer>
          <Details>
            {course.ects && (
              <CourseLength>
                <Typography variant="subtitle2">
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
            )}
            {/* TODO: add information regarding university/organization to course */}
            <Typography variant="subtitle2">Helsingin yliopisto</Typography>
          </Details>
          <LanguageTags>
            {course?.tags
              ?.filter((t) => t.types?.includes("language"))
              .map((tag) => (
                <LanguageTag size="small" variant="contained" disabled>
                  {tag.id.split("_")[0].toUpperCase()}
                </LanguageTag>
              ))}
          </LanguageTags>
          <DifficultyTags>
            {course?.tags
              ?.filter((t) => t.types?.includes("difficulty"))
              .map((tag) => (
                <DifficultyTagContainer>
                  <DifficultyTag size="small" variant="contained" disabled>
                    {tag.id}
                  </DifficultyTag>
                  {tag.id === "beginner" ? (
                    <CircleContainer>
                      <StyledCircleIcon />
                      <StyledCircleOutlinedIcon />
                      <StyledCircleOutlinedIcon />
                    </CircleContainer>
                  ) : tag.id === "intermediate" ? (
                    <CircleContainer>
                      <StyledCircleIcon />
                      <StyledCircleIcon />
                      <StyledCircleOutlinedIcon />
                    </CircleContainer>
                  ) : (
                    <CircleContainer>
                      <StyledCircleIcon />
                      <StyledCircleIcon />
                      <StyledCircleIcon />
                    </CircleContainer>
                  )}
                </DifficultyTagContainer>
              ))}
          </DifficultyTags>
          <Link eventLabel="to_course_material" to="https://www.mooc.fi">
            {t("showCourse")}
          </Link>
        </RightContentContainer>
        {/* <SponsorContainer>
          <Sponsor src={sponsorLogo.src} alt="Sponsor logo" fill />
        </SponsorContainer> */}
      </ContentContainer>
    </Container>
  )
}

export const CourseCardSkeleton = () => (
  <SkeletonContainer>
    <TitleContainer>
      <Title>
        <Skeleton width={100 + Math.random() * 100} />
      </Title>
    </TitleContainer>
    <ContentContainer>
      <Description>
        <Typography variant="body1">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Typography>
      </Description>
      <Details>
        <Typography variant="subtitle2">
          <Skeleton width={75} />
        </Typography>
      </Details>
      <Schedule>
        <Skeleton />
      </Schedule>
      {/* <SponsorContainer /> */}
      <Tags />
      <Skeleton />
    </ContentContainer>
  </SkeletonContainer>
)

export default CourseCard
