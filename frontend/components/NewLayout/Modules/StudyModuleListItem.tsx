import { useCallback, useEffect, useMemo, useRef } from "react"

import { Skeleton, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CorrectedAnchor } from "../Common"
import { CardWrapper } from "../Common/Card"
import ContentWrapper from "../Common/ContentWrapper"
import CTALink from "../Common/CTALink"
import CourseCard, { CourseCardSkeleton } from "../Courses/CourseCard"
import useIsomorphicLayoutEffect from "/hooks/useIsomorphicLayoutEffect"
import { useTranslator } from "/hooks/useTranslator"
import StudyModulesTranslations from "/translations/_new/study-modules"

import {
  CourseStatus,
  NewStudyModuleFieldsWithCoursesFragment,
} from "/graphql/generated"

interface StudyModuleListItemProps {
  studyModule: NewStudyModuleFieldsWithCoursesFragment
  backgroundColor: string
}

const HeroContainer = styled("li")`
  --hero-span: 1;

  display: block;
  position: relative;
  min-height: 0;
  min-width: 0;
  grid-row: auto / span var(--hero-span);
  overflow: hidden;
`

const ModuleSectionRoot = styled(CardWrapper, {
  shouldForwardProp: (prop) => prop !== "backgroundColor" && prop !== "as",
})<{ backgroundColor: string }>(
  ({ theme, backgroundColor }) => `
  list-style-type: none;
  border-radius: 0;
  box-shadow: none;
  border: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 3rem;
  position: relative;
  z-index: 0;
  background-color: #fefefe;
  background-image: linear-gradient(to left, rgba(255,0,0,0), ${backgroundColor} 55%);

  ${theme.breakpoints.down("lg")} {
    background-image: linear-gradient(to top, rgba(255,0,0,0), ${backgroundColor} 55%);
  }
`,
)

const ModuleSectionBody = styled("ul")`
  --_cols: max(
    1,
    var(--cols, 3)
  ); /* Ideal number of columns is 3 by default; at least one! */
  --_gap: var(--gap, 1.5rem); /* space between each card */
  --_min: var(
    --min,
    min(470px, calc(100vw - 3rem))
  ); /* card must be at least this wide */
  --_max: var(--max, 100%); /* cards cannot be wider than this size */

  list-style: none;
  padding: 2rem 1.5rem 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(
      max(
        var(--_min),
        calc((100% - var(--_gap) * (var(--_cols) - 1)) / var(--_cols))
      ),
      1fr
    )
  );
  grid-auto-rows: 1fr;
  background-color: transparent;
  grid-gap: var(--_gap);
  grid-auto-flow: row;
  width: 100%;
`

const ModuleSectionDescription = styled("div")`
  padding: 1rem;
  display: flex;
  margin: 0;
  flex-direction: column;
  color: #fff;
`

const ModuleSectionDescriptionText = styled(Typography)`
  font-family: var(--body-font) !important;
  font-weight: 200 !important;
`

const ImageBackgroundBase = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: 200%;
  background-position: center 40%;
  z-index: -5;
`

const SkeletonBackground = styled("span")`
  ${ImageBackgroundBase.styles};
  background-color: #eee;
`

const CenteredHeader = styled(Typography)(
  ({ theme }) => `
  margin-bottom: 2rem;
  color: ${theme.palette.common.grayscale.white}
`,
) as typeof Typography

const EndedCoursesLinkContainer = styled("div")`
  padding: 0rem 1rem 1rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const StyledCTALink = styled(CTALink)`
  background: #fff;
  padding-left: 1rem;
`

const getCoursesByStatus = (
  courses: NewStudyModuleFieldsWithCoursesFragment["courses"],
) => {
  const filteredCourses = courses?.filter((course) => course.description) ?? []
  const active = filteredCourses.filter(
    (course) => course.status === CourseStatus.Active,
  )
  const upcoming = filteredCourses.filter(
    (course) => course.status === CourseStatus.Upcoming,
  )
  const ended = filteredCourses.filter(
    (course) => course.status === CourseStatus.Ended,
  )

  return { active, upcoming, ended }
}

export function ListItem({
  studyModule,
  backgroundColor,
}: StudyModuleListItemProps) {
  const t = useTranslator(StudyModulesTranslations)

  const descriptionRef = useRef<HTMLElement | null>()
  const ModuleSectionRef = useRef<HTMLLIElement | null>()
  const { active, upcoming, ended } = useMemo(
    () => getCoursesByStatus(studyModule.courses),
    [studyModule],
  )

  const setDescriptionHeight = useCallback(() => {
    const description = descriptionRef.current
    const ModuleSection = ModuleSectionRef.current

    if (!description || !ModuleSection) {
      return
    }

    let cardHeight = 0
    ModuleSection.childNodes?.forEach((child) => {
      if (child instanceof HTMLElement) {
        cardHeight += child.clientHeight
      }
    })
    const currentSpan =
      Number(description.style.getPropertyValue("--hero-span")) || 1
    const descriptionUnitHeight = description.clientHeight / currentSpan
    if (
      (descriptionUnitHeight > cardHeight && currentSpan < 2) ||
      (descriptionUnitHeight < cardHeight && currentSpan > 1)
    ) {
      const span = Math.ceil(description.scrollHeight / cardHeight) // the max size of row should be in a var
      description.style.setProperty("--hero-span", `${span}`)
    }
  }, [descriptionRef.current, ModuleSectionRef.current])

  useEffect(() => {
    if (!window) {
      return () => void 0
    }

    window.addEventListener("resize", setDescriptionHeight)

    return () => {
      window.removeEventListener("resize", setDescriptionHeight)
    }
  }, [])

  useIsomorphicLayoutEffect(setDescriptionHeight, [studyModule.description])

  // TODO: the anchor link may have to be shifted by the amount of the header again
  return (
    <ModuleSectionRoot as="li" backgroundColor={backgroundColor}>
      <CorrectedAnchor id={studyModule.slug} />
      <ContentWrapper>
        <ModuleSectionBody>
          <HeroContainer>
            <ModuleSectionDescription
              ref={(ref) => (descriptionRef.current = ref)}
            >
              <CenteredHeader variant="h1" component="h2">
                {studyModule.name}
              </CenteredHeader>
              <ModuleSectionDescriptionText variant="ingress">
                {studyModule.description}
              </ModuleSectionDescriptionText>
            </ModuleSectionDescription>
          </HeroContainer>
          {[active, upcoming].flatMap(
            (courses) =>
              courses?.map((course, index) => (
                <CourseCard
                  ref={(ref) => {
                    if (index === 0) {
                      ModuleSectionRef.current = ref
                    }
                  }}
                  course={course}
                  studyModule={studyModule.slug}
                  key={course.id}
                />
              )),
          )}
          {/* TODO: do something with ended courses */}
        </ModuleSectionBody>
        {ended.length > 0 && (
          <EndedCoursesLinkContainer>
            <StyledCTALink
              href={`/_new/courses/?tag=${studyModule.slug}&status=${CourseStatus.Ended}`}
            >
              {t("showEndedCourses")}
            </StyledCTALink>
          </EndedCoursesLinkContainer>
        )}
      </ContentWrapper>
    </ModuleSectionRoot>
  )
}

// can't use a Root for the course list because of the grid?
export function ListItemSkeleton({
  backgroundColor,
}: {
  backgroundColor: string
}) {
  return (
    <ModuleSectionRoot as="section" backgroundColor={backgroundColor}>
      <SkeletonBackground />
      <ModuleSectionBody>
        <HeroContainer>
          <ModuleSectionDescription>
            <CenteredHeader variant="h1">
              <Skeleton />
            </CenteredHeader>
            <Typography variant="subtitle1">
              <Skeleton />
            </Typography>
          </ModuleSectionDescription>
        </HeroContainer>
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
      </ModuleSectionBody>
    </ModuleSectionRoot>
  )
}
