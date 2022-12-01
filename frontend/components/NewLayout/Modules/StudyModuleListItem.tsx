import { useCallback, useEffect, useMemo, useRef } from "react"

import { Skeleton, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

import BackgroundPattern from "../../../static/images/backgroundPattern.svg"
import { CorrectedAnchor } from "../Common"
import { CardHeader, CardWrapper } from "../Common/Card"
import CourseCard, { CourseCardSkeleton } from "../Courses/CourseCard"

import { StudyModuleFieldsWithCoursesFragment } from "/graphql/generated"

interface StudyModuleListItemProps {
  module: StudyModuleFieldsWithCoursesFragment
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
})<{ backgroundColor: string }>`
  border-radius: 0;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 3rem;
  position: relative;
  z-index: -8;
  background-color: #fefefe;
  ${(props) =>
    `background-image: linear-gradient(to left, rgba(255,0,0,0) ,${props.backgroundColor} 55%);`}
  @media(max-width: 1200px) {
    ${(props) =>
      `background-image: linear-gradient(to top, rgba(255,0,0,0) ,${props.backgroundColor} 55%);`}
  }
`

const ModuleCardBody = styled("ul")`
  --_cols: max(
    1,
    var(--cols, 3)
  ); /* Ideal number of columns is 3 by default; at least one! */
  --_gap: var(--gap, 2.5rem); /* Space between each logo */
  --_min: var(--min, 420px); /* Logos must be at least this wide */
  --_max: var(--max, 100%); /* Logos cannot be wider than this size */

  list-style-position: inside;
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
  grid-template-rows: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); ///repeat(auto-fit, 1fr);
  background-color: transparent;
  grid-gap: var(--_gap); // 2rem;
  grid-auto-flow: row;
`

const ModuleCardDescription = styled("div")`
  padding: 1rem;
  display: flex;
  // height: 100%;
  margin: 0;
  flex-direction: column;
  color: white;
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
  ${ImageBackgroundBase};
  background-image: url(${(props) => props.src});
`

const SkeletonBackground = styled("span")`
  ${ImageBackgroundBase};
  width: 100%;
  background-color: #eee;
`

const ModuleCardHeader = styled(CardHeader)`
  height: 200px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const CenteredHeader = styled(Typography)`
  margin-bottom: 2rem;
`

const ModuleCourseCard = styled(CourseCard)``

export function ListItem({
  module,
  backgroundColor,
}: StudyModuleListItemProps) {
  const descriptionRef = useRef<HTMLElement | null>()
  const courses = useMemo(
    () => module.courses?.filter((course) => course.description) ?? [],
    [module],
  )
  /*const imageUrl = `../../../static/images/${
    module.image ?? module.slug + "jpg"
  }`*/

  const setDescriptionHeight = useCallback(() => {
    const description = descriptionRef.current
    if (!description) {
      return
    }

    if (description.scrollHeight > description.clientHeight) {
      const span = Math.round(description.scrollHeight / 200) // the max size of row should be in a var
      description.style.cssText = `--hero-span: ${span};`
    }
  }, [descriptionRef.current])

  useEffect(() => {
    if (!window) {
      return () => void 0
    }
    window.addEventListener("resize", setDescriptionHeight)

    return () => {
      window.removeEventListener("resize", setDescriptionHeight)
    }
  })
  useEffect(setDescriptionHeight, [module.description])

  // TODO: the anchor link may have to be shifted by the amount of the header again
  return (
    <ModuleCardWrapper as="section" backgroundColor={backgroundColor}>
      <CorrectedAnchor id={module.slug} />
      <ImageBackground src={BackgroundPattern} />
      <ModuleCardBody>
        <HeroContainer ref={(ref) => (descriptionRef.current = ref)}>
          <ModuleCardDescription>
            <CenteredHeader variant="h1">{module.name}</CenteredHeader>
            <Typography variant="subtitle1">{module.description}</Typography>
          </ModuleCardDescription>
        </HeroContainer>
        {courses?.map((course) => (
          <ModuleCourseCard course={course} key={course.id} />
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
    <ModuleCardWrapper backgroundColor={backgroundColor}>
      <SkeletonBackground />
      <ModuleCardHeader>
        <CenteredHeader variant="h1">
          <Skeleton />
        </CenteredHeader>
      </ModuleCardHeader>
      <ModuleCardBody>
        <HeroContainer>
          <ModuleCardDescription>
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
