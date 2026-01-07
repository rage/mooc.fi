import React from "react"

import { PropsOf } from "@emotion/react"
import BookIcon from "@fortawesome/fontawesome-free/svgs/solid/book-open.svg?icon"
import GraduationCapIcon from "@fortawesome/fontawesome-free/svgs/solid/graduation-cap.svg?icon"
import HandshakeIcon from "@fortawesome/fontawesome-free/svgs/solid/handshake.svg?icon"
import HelpIcon from "@mui/icons-material/Help"
import { Link, Skeleton, Typography, useMediaQuery } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import CTALink from "../Common/CTALink"
import FlipchartIcon from "../Icons/FlipChart"
import { courseColorSchemes } from "./common"
import Sponsors from "./Sponsors"
import { DifficultyTags, LanguageTags, ModuleTags } from "./Tags"
import Tooltip from "/components/Tooltip"
import { useTranslator } from "/hooks/useTranslator"
import { NewCourseFields } from "/lib/api-types"
import { fontSize } from "/src/theme/util"
import CommonTranslations from "/translations/common"
import { useFormatDateTime } from "/util/dataFormatFunctions"
import withNoSsr from "/util/withNoSsr"

import { CourseStatus } from "/graphql/generated"

const ContainerBase = css`
  list-style-type: none;
  margin: 0 auto;
  width: 100%;
`

const CourseCardRoot = styled("li")(
  ({ theme }) => `
  ${ContainerBase.styles}
  height: 100%;
  display: block;
  container-type: inline-size;
  ${theme.breakpoints.up(768)} {
    min-width: 470px;
    max-height: 500px;
  }
`,
)

const SkeletonRoot = styled("li")`
  ${ContainerBase.styles};
  height: 100%;
  display: block;
  container-type: inline-size;
`

const CardContainer = styled("article")(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  background-color: ${theme.palette.common.grayscale.backgroundBox};
  height: 100%;
  ${theme.breakpoints.up(768)} {
    flex-direction: row;
  }
`,
)

const ModuleColor = styled("div", {
  shouldForwardProp: (prop) => prop !== "studyModule" && prop !== "ended",
})<{ studyModule?: string; ended?: boolean }>(
  ({ theme, studyModule }) => `
  overflow: hidden;
  line-height: 0;
  position: relative;
  display: flex;
  width: 100%;
  max-height: 80px;
  height: 80px;

  background-color: ${
    studyModule ? courseColorSchemes[studyModule] : courseColorSchemes["other"]
  };

  ${theme.breakpoints.up(768)} {
    width: 80px;
    max-height: 100%;
    height: auto;
  }
`,
)

const TextContainer = styled("div")`
  margin-right: 2rem;
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem 0 1rem 2rem;
  ${theme.breakpoints.up(768)} {
    width: calc(100% - 100px);
  }
  ${theme.breakpoints.down("sm")} {
    padding: 1rem;
  }
`,
)

const Title = styled(Typography)(
  ({ theme }) => `
  &.MuiTypography-h3 {
    ${fontSize(22, 32)}
    font-weight: 700;
    letter-spacing: -0.44px;
    color: ${theme.palette.common.brand.main};
    margin-bottom: 0.5rem !important;
    margin-top: 0 !important;
    padding: 0;
      ${theme.breakpoints.down("sm")} {
      ${fontSize(18, 24)}
      letter-spacing: -0.36px;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }
  }

  a {
    text-decoration: none;
    color: ${theme.palette.common.brand.main};

    &:hover {
      text-decoration: underline;
      color: ${theme.palette.common.brand.active};
    }
  }
`,
) as typeof Typography

const Description = styled(Typography)(
  ({ theme }) => `
  ${fontSize(16, 24)}
  letter-spacing: 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;

  ${theme.breakpoints.down(768)} {
    max-height: 196px;
  }
  ${theme.breakpoints.down("sm")} {
    ${fontSize(15, 22)};
    max-height: 330px;
  }
`,
)

const CourseDetails = styled("div")(
  ({ theme }) => `
  ${fontSize(15, 18)}
  font-weight: 700;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;
  color: ${theme.palette.common.brand.nearlyBlack};

  ${theme.breakpoints.between(768, "lg")} {
    margin-bottom: 0.5rem;
  }
  ${theme.breakpoints.down("sm")} {
    ${fontSize(14, 18)}
    margin-top: 1.5rem;
    gap: 0.5rem;
  }
`,
)

const CourseDetailItemContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  align-items: center;
  color: ${theme.palette.common.brand.nearlyBlack};
  margin-bottom: 0.25rem;
  margin-right: 2rem;
`,
)

type CourseDetailItemProps<
  IconType extends React.ComponentType = React.ComponentType,
  IconPropsType extends PropsOf<IconType> = any,
> = {
  icon?: IconType
  IconProps?: IconPropsType
} & PropsOf<typeof CourseDetailItemContainer>

const CourseDetailItem = ({
  icon: Icon,
  IconProps = {},
  children,
  ...props
}: React.PropsWithChildren<CourseDetailItemProps>) => (
  <CourseDetailItemContainer {...props}>
    {Icon && <Icon {...IconProps} />}
    {children}
  </CourseDetailItemContainer>
)

const Actions = styled("div")(
  ({ theme }) => `
  width: calc(100% + 2rem);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  gap: 0.5rem;
  ${theme.breakpoints.between("sm", 768)} {
    width: calc(100% + 1rem);
  }
  ${theme.breakpoints.down("sm")} {
    width: calc(100% + 2rem);
  }
`,
)

const Tags = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  width: calc(100% - 2rem);
  ${theme.breakpoints.down("sm")} {
    width: calc(50% - 2rem);
  }
`,
)

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

const iconStyle = css`
  display: flex;
  width: 19px;
  height: 19px;
  margin-right: 0.5rem;
`

const Flipchart = styled(FlipchartIcon)`
  ${iconStyle.styles}
`

const GraduationCap = styled(GraduationCapIcon)`
  ${iconStyle.styles}
`

const Book = styled(BookIcon)`
  ${iconStyle.styles}
`

const Handshake = styled(HandshakeIcon)`
  ${iconStyle.styles}
`

const CourseLink = styled(CTALink)(
  ({ theme }) => `
  ${fontSize(18, 24)}
  text-align: right;
  letter-spacing: -0.36px;
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;

  ${theme.breakpoints.down("sm")} {
    ${fontSize(15, 18)}
    letter-spacing: -0.3px;
  }
`,
) as typeof CTALink

interface ScheduleProps {
  course?: NewCourseFields
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
          start_date ? " " + formatLocaleDateTime(start_date) : ""
        }`
      } else if (status === CourseStatus.Ended) {
        schedule = `${t("Ended")}${
          end_date && Date.parse(end_date) < Date.now()
            ? " " + formatLocaleDateTime(end_date)
            : ""
        }`
      } else {
        schedule = `${t("Active")} ${
          end_date
            ? formatLocaleDateTime(start_date) +
              " - " +
              formatLocaleDateTime(end_date)
            : "— " + t("unscheduled")
        }`
      }
    }

    return (
      <CourseDetailItem>
        <Flipchart />
        {schedule}
        {children}
      </CourseDetailItem>
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
  sponsors?: React.ReactNode
  link: React.ReactNode
  href?: string | null
  studyModule?: string
  ended?: boolean
  upcoming?: boolean
}

function CourseCardLayout({
  title,
  href,
  description,
  schedule,
  details,
  organizer,
  moduleTags,
  languageTags,
  difficultyTags,
  sponsors,
  link,
  ended,
  studyModule,
  upcoming,
}: CourseCardLayoutProps) {
  return (
    <CardContainer>
      <ModuleColor studyModule={studyModule} ended={ended} />
      <ContentContainer>
        <TextContainer>
          <Title variant="h3">
            {upcoming ? title : <Link href={href ?? "#"}>{title}</Link>}
          </Title>
          {description && <Description>{description}</Description>}
        </TextContainer>
        <CourseDetails>
          {details}
          {schedule}
          {organizer}
          {sponsors}
        </CourseDetails>
        <Actions>
          <Tags>
            {languageTags}
            {difficultyTags}
            {moduleTags}
          </Tags>
          {link}
        </Actions>
      </ContentContainer>
    </CardContainer>
  )
}

interface CourseCardProps {
  course: NewCourseFields
  studyModule?: string
}

const CourseCard = React.forwardRef<
  HTMLLIElement,
  CourseCardProps & PropsOf<typeof CourseCardRoot>
>(({ course, studyModule, ...props }, ref) => {
  const t = useTranslator(CommonTranslations)
  const abbreviate = useMediaQuery("(max-width: 800px)")

  const courseStudyModule =
    studyModule ?? course.study_modules[0]?.slug ?? "other"

  const linkActive =
    course?.status != "Upcoming" || course?.upcoming_active_link

  return (
    <CourseCardRoot ref={ref} {...props}>
      <CourseCardLayout
        studyModule={courseStudyModule}
        ended={course?.status === CourseStatus.Ended}
        upcoming={course?.status === CourseStatus.Upcoming}
        title={course?.name}
        description={course?.description}
        schedule={<Schedule course={course} />}
        details={
          course.ects && (
            <CourseDetailItem icon={Book}>
              {course.ects}&nbsp;op&nbsp;(~
              {Math.round((parseInt(course.ects) * 27) / 5) * 5}h)
              <StyledTooltip
                title={`${t("ectsHoursExplanation1")} ${course.ects} ${t(
                  "ectsHoursExplanation2",
                )}`}
              >
                <StyledHelpIcon />
              </StyledTooltip>
            </CourseDetailItem>
          )
        }
        /* TODO: add information regarding university/organization to course */
        organizer={
          <CourseDetailItem icon={GraduationCap}>
            Helsingin yliopisto
          </CourseDetailItem>
        }
        languageTags={<LanguageTags course={course} abbreviated={abbreviate} />}
        difficultyTags={
          <DifficultyTags course={course} abbreviated={abbreviate} />
        }
        moduleTags={<ModuleTags course={course} abbreviated={abbreviate} />}
        link={
          course?.link &&
          linkActive && (
            <CourseLink href={course?.link} target="_blank">
              {t("showCourse")}
            </CourseLink>
          )
        }
        href={course?.link}
        sponsors={
          (course.sponsors ?? []).length > 0 && (
            <CourseDetailItem icon={Handshake}>
              <Sponsors data={course.sponsors} />
            </CourseDetailItem>
          )
        }
      />
    </CourseCardRoot>
  )
})

export const CourseCardSkeleton = () => (
  <SkeletonRoot>
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
        <CourseDetailItem>
          <Skeleton width={200} height={20} />
        </CourseDetailItem>
      }
      details={
        <CourseDetailItem>
          <Skeleton width={180} height={20} />
        </CourseDetailItem>
      }
      organizer={
        <CourseDetailItem>
          <Skeleton width={100} height={20} />
        </CourseDetailItem>
      }
      moduleTags={<Skeleton width={140} height={20} />}
      languageTags={<Skeleton width={120} height={20} />}
      difficultyTags={<Skeleton width={100} height={20} />}
      link={<Skeleton width={150} />}
    />
  </SkeletonRoot>
)

export default withNoSsr(CourseCard)
