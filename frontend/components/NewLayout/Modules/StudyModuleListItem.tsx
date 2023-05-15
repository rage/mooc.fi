import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react"

import { Skeleton, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { CorrectedAnchor } from "../Common"
import { CardWrapper } from "../Common/Card"
import CourseCard, { CourseCardSkeleton } from "../Courses/CourseCard"
import backgroundPattern from "/public/images/new/background/backgroundPattern.svg"

import { StudyModuleFieldsWithCoursesFragment } from "/graphql/generated"

interface StudyModuleListItemProps {
  studyModule: StudyModuleFieldsWithCoursesFragment
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

const ModuleCardWrapper = styled(CardWrapper, {
  shouldForwardProp: (prop) => prop !== "backgroundColor" && prop !== "as",
})<{ backgroundColor: string }>(
  ({ theme, backgroundColor }) => `
  border-radius: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 3rem;
  position: relative;
  z-index: -8;
  background-color: #fefefe;
  background-image: linear-gradient(to left, rgba(255,0,0,0), ${backgroundColor} 55%);

  ${theme.breakpoints.down("lg")} {
    background-image: linear-gradient(to top, rgba(255,0,0,0), ${backgroundColor} 55%);
  }
`,
)

const ModuleCardBody = styled("ul")`
  --_cols: max(
    1,
    var(--cols, 3)
  ); /* Ideal number of columns is 3 by default; at least one! */
  --_gap: var(--gap, 1.5rem); /* space between each card */
  --_min: var(
    --min,
    min(360px, calc(100vw - 3rem))
  ); /* card must be at least this wide */
  --_max: var(--max, 100%); /* cards cannot be wider than this size */

  list-style: none;
  padding: 1rem;
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
  grid-template-rows: repeat(auto-fill, 1fr);
  background-color: transparent;
  grid-gap: var(--_gap);
  grid-auto-flow: row;
  width: 100%;
`

const ModuleCardDescription = styled("div")`
  padding: 1rem;
  display: flex;
  margin: 0;
  flex-direction: column;
  color: #fff;
`

const ModuleCardDescriptionText = styled(Typography)`
  font-family: var(--body-font) !important;
  font-weight: 400 !important;
`

const ImageBackgroundBase = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center 40%;
  z-index: -5;
`

const ImageBackground = styled("span", {
  shouldForwardProp: (prop) => prop !== "src",
})<{ src: string }>`
  ${ImageBackgroundBase.styles};
  background-image: url(${(props) => props.src});
`

const SkeletonBackground = styled("span")`
  ${ImageBackgroundBase.styles};
  background-color: #eee;
`

const CenteredHeader = styled(Typography)`
  margin-bottom: 2rem;
` as typeof Typography

// const ModuleCourseCard = styled(CourseCard)``

export function ListItem({
  studyModule,
  backgroundColor,
}: StudyModuleListItemProps) {
  const descriptionRef = useRef<HTMLElement | null>()
  const moduleCardRef = useRef<HTMLLIElement | null>()
  const courses = useMemo(
    () => studyModule.courses?.filter((course) => course.description) ?? [],
    [studyModule],
  )

  const setDescriptionHeight = useCallback(() => {
    const description = descriptionRef.current
    const moduleCard = moduleCardRef.current

    if (!description || !moduleCard) {
      return
    }

    let cardHeight = 0
    moduleCard.childNodes?.forEach((child) => {
      if (child instanceof HTMLElement) {
        cardHeight += child.clientHeight
      }
    })
    const currentSpan = Number(
      description.style.getPropertyValue("--hero-span"),
    )
    if (description.clientHeight > cardHeight && currentSpan < 2) {
      const span = Math.ceil(description.scrollHeight / cardHeight) // the max size of row should be in a var
      description.style.cssText = `--hero-span: ${span};`
    }
  }, [descriptionRef.current, moduleCardRef.current])

  useEffect(() => {
    if (!window) {
      return () => void 0
    }

    window.addEventListener("resize", setDescriptionHeight)

    return () => {
      window.removeEventListener("resize", setDescriptionHeight)
    }
  }, [])

  useLayoutEffect(setDescriptionHeight, [studyModule.description])

  // TODO: the anchor link may have to be shifted by the amount of the header again
  return (
    <ModuleCardWrapper as="section" backgroundColor={backgroundColor}>
      <CorrectedAnchor id={studyModule.slug} />
      <ImageBackground src={backgroundPattern.src} />*
      <ModuleCardBody>
        <HeroContainer ref={(ref) => (descriptionRef.current = ref)}>
          <ModuleCardDescription>
            <CenteredHeader variant="h3" component="h2">
              {studyModule.name}
            </CenteredHeader>
            <ModuleCardDescriptionText variant="ingress">
              {studyModule.description}
              {studyModule.description}
            </ModuleCardDescriptionText>
          </ModuleCardDescription>
        </HeroContainer>
        {courses?.map((course, index) => (
          <CourseCard
            ref={(ref) => {
              if (index === 0) {
                moduleCardRef.current = ref
              }
            }}
            course={course}
            key={course.id}
          />
        ))}
      </ModuleCardBody>
    </ModuleCardWrapper>
  )
}

// can't use a wrapper for the course list because of the grid?
export function ListItemSkeleton({
  backgroundColor,
}: {
  backgroundColor: string
}) {
  return (
    <ModuleCardWrapper as="section" backgroundColor={backgroundColor}>
      <SkeletonBackground />
      <ModuleCardBody>
        <HeroContainer>
          <ModuleCardDescription>
            <CenteredHeader variant="h1">
              <Skeleton />
            </CenteredHeader>
            <Typography variant="subtitle1">
              <Skeleton />
            </Typography>
          </ModuleCardDescription>
        </HeroContainer>
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
      </ModuleCardBody>
    </ModuleCardWrapper>
  )
}
