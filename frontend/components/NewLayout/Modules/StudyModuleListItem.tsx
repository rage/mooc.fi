import { useMemo } from "react"

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
`

const CourseContainer = styled("div")`
  display: flex;
`

const ModuleCardWrapper = styled(CardWrapper)`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 1rem;
`

ModuleCardWrapper.defaultProps = {
  as: "div",
}

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
`

const SkeletonBackground = styled("span")`
  ${ImageBackgroundBase};
  width: 100%;
  background-color: #eee;
`

const ModuleCardHeader = styled(CardHeader)`
  height: 400px;
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
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
        <CourseCard course={course} key={course.id} />
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
  const courses = useMemo(
    () => module.courses?.filter((course) => course.description) ?? [],
    [module],
  )
  return (
    <Container>
      <ModuleCardWrapper>
        <Hero image={module.image ?? `${module.slug}.jpg`} name={module.name} />
        <CardBody>
          <CardDescription>{module.description}</CardDescription>
        </CardBody>
      </ModuleCardWrapper>
      <CourseContainer>
        <CourseList courses={courses} />
      </CourseContainer>
    </Container>
  )
}

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
