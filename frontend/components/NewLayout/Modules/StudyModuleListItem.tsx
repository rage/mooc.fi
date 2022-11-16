import { useCallback, useEffect, useMemo, useRef } from "react"

import { css } from "@emotion/react"
import { Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  CardBody,
  CardDescription,
  CardHeader,
  CardWrapper,
} from "../Common/Card"
import CourseCard, { CourseCardSkeleton } from "../Courses/CourseCard"

import { StudyModuleFieldsWithCoursesFragment } from "/graphql/generated"

interface StudyModuleListItemProps {
  module: StudyModuleFieldsWithCoursesFragment
}

const Container = styled("li")`
  margin-bottom: 2rem;
  position: relative;
`

const HeroContainer = styled("section")`
  display: block;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 400px;
  min-height: 100%;
`
const CourseContainer = styled("div")`
  display: flex;
`

const ModuleCardWrapper = styled(CardWrapper)`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 1rem;
  position: relative;
`

const ModuleCardBody = styled("ul")`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(300px, 1fr));
  background-color: transparent;
  grid-gap: 2rem;
  grid-auto-flow: row dense;

  /*section { // ingress/hero
    grid-row: auto / span 2;
  }*/
`

const ModuleCardDescription = styled(CardDescription)`
  background-color: #fff;
  padding: 1rem;
  display: flex;
  flex-grow: 1;
  height: 100%;
  margin: 0;
`

const ImageBackgroundBase = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center 40%;
  z-index: -10;
`

const ImageBackground = styled("span")<{ src: string }>`
  ${ImageBackgroundBase};
  background-image: url(${(props) => props.src});
  opacity: 0.4;
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
`

const CenteredHeader = styled(Typography)`
  margin: auto;
  background-color: white;
  padding: 1rem;
`

const CourseGrid = styled("ul")`
  list-style-position: inside;
  padding: 0;
  grid-gap: 1rem;
  width: 100%;
`

const ModuleCourseCard = styled(CourseCard)`
  margin: 6000rem;
  max-height: 200px;
  grid-column: auto / span 2 !important;
  grid-row-end: span 1;
`

type StudyModuleListItemHeroProps = {
  image:
    | StudyModuleFieldsWithCoursesFragment["image"]
    | StudyModuleFieldsWithCoursesFragment["slug"]
  name: StudyModuleFieldsWithCoursesFragment["name"]
}

function Hero({ image, name }: StudyModuleListItemHeroProps) {
  const imageUrl = `../../../static/images/${image}`

  // TODO
  return (
    <ModuleCardHeader>
      <ImageBackground src={imageUrl} />
      <CenteredHeader variant="h2">{name}</CenteredHeader>
    </ModuleCardHeader>
  )
}

function HeroSkeleton() {
  return (
    <ModuleCardHeader>
      <SkeletonBackground />
      <CenteredHeader variant="h2">
        <Skeleton width={300 + Math.random() * 400} />
      </CenteredHeader>
    </ModuleCardHeader>
  )
}

type StudyModuleCoursesProps = Pick<
  StudyModuleFieldsWithCoursesFragment,
  "courses"
>

function CourseList({ courses }: StudyModuleCoursesProps) {
  // TODO
  return (
    <CourseGrid>
      {courses?.map((course) => (
        <ModuleCourseCard course={course} key={course.id} />
      ))}
    </CourseGrid>
  )
}

function CourseListSkeleton() {
  return (
    <CourseGrid>
      <CourseCardSkeleton />
      <CourseCardSkeleton />
      <CourseCardSkeleton />
      <CourseCardSkeleton />
    </CourseGrid>
  )
}

export function ListItem({ module }: StudyModuleListItemProps) {
  const des = module.name.includes("Ohj")
    ? "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et, sequi dolor maiores hic atque vel, officia animi maxime accusamus voluptate laborum eaque ea reiciendis beatae labore cupiditate, aliquid quis consequuntur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, beatae. Voluptatem recusandae est voluptatibus fugit tempore omnis delectus maxime praesentium repellendus voluptate? Sint a eveniet, dolorum cum distinctio repudiandae maiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus error hic voluptatum? Placeat commodi optio quisquam, animi est quibusdam architecto, ipsam tenetur, provident aspernatur quas dicta. In soluta modi neque. Placeat commodi optio quisquam, animi est quibusdam architecto, ipsam tenetur, provident aspernatur quas dicta. In soluta modi neque."
    : module.description
  const descriptionRef = useRef<HTMLElement | null>()
  const courses = useMemo(
    () => module.courses?.filter((course) => course.description) ?? [],
    [module],
  )
  const imageUrl = `../../../static/images/${
    module.image ?? module.slug + "jpg"
  }`

  const setDescriptionHeight = useCallback(() => {
    const description = descriptionRef.current
    if (!description) {
      return
    }

    if (description.scrollHeight > description.offsetHeight) {
      // description.style.height = '0px';
      description.style.height = description.scrollHeight + "px"
      description.style.gridRow = `auto / span 2` // ${2 + Math.floor(description.scrollHeight / description.offsetHeight)}`;
    } /* else {
      description.style.height = '100%';
      description.style.gridRow = '';
    }*/
  }, [descriptionRef.current])

  useEffect(() => {
    if (!window) {
      return () => {}
    }
    window.addEventListener("resize", setDescriptionHeight)

    return () => {
      window.removeEventListener("resize", setDescriptionHeight)
    }
  })
  useEffect(setDescriptionHeight, [des])

  return (
    <ModuleCardWrapper>
      <ImageBackground src={imageUrl} />
      {/*<Hero image={module.image ?? `${module.slug}.jpg`} name={module.name} />*/}
      <ModuleCardHeader>
        <CenteredHeader variant="h1">{module.name}</CenteredHeader>
      </ModuleCardHeader>
      <ModuleCardBody>
        <HeroContainer ref={(ref) => (descriptionRef.current = ref)}>
          <ModuleCardDescription>
            <Typography variant="subtitle1">{des}</Typography>
          </ModuleCardDescription>
        </HeroContainer>
        {courses?.map((course) => (
          <ModuleCourseCard course={course} key={course.id} />
        ))}
        {/*<CourseList courses={courses} />*/}
      </ModuleCardBody>
    </ModuleCardWrapper>
  )
}
// can't use a wrapper for the course list because of the grid?
// TODO: update skeleton to use the grid thingy
export function ListItemSkeleton() {
  return (
    <Container>
      <ModuleCardWrapper>
        <HeroSkeleton />
        <CardBody>
          <CardDescription>
            <Skeleton width="100%" />
            <Skeleton width="100%" />
            <Skeleton width="40%" />
          </CardDescription>
        </CardBody>
      </ModuleCardWrapper>
      <CourseContainer>
        <CourseListSkeleton />
      </CourseContainer>
    </Container>
  )
}
