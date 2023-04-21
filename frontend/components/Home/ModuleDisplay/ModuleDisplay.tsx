import { useMemo } from "react"

import { orderBy } from "lodash"

import { styled } from "@mui/material/styles"

import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"
import ModuleDisplayContent from "/components/Home/ModuleDisplay/ModuleDisplayContent"
import ModuleDisplaySkeleton from "/components/Home/ModuleDisplay/ModuleDisplaySkeleton"

import {
  CourseStatus,
  FrontpageCourseFieldsFragment,
  StudyModuleFieldsFragment,
} from "/graphql/generated"

type StudyModuleWithFrontpageCourse = StudyModuleFieldsFragment & {
  courses: Array<FrontpageCourseFieldsFragment>
}

interface ModuleProps {
  studyModule?: StudyModuleWithFrontpageCourse
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

const ModuleContainer = styled("section")`
  margin-bottom: 3em;
`

function Module(props: ModuleProps) {
  const { studyModule, hueRotateAngle, brightness, backgroundColor } = props

  const orderedCourses = useMemo(
    () =>
      orderBy(
        studyModule?.courses ?? [],
        [
          (course) => course.study_module_order,
          (course) => course.study_module_start_point === true,
          (course) => course.status === CourseStatus.Active,
          (course) => course.status === CourseStatus.Upcoming,
        ],
        ["desc", "desc", "desc"],
      ),
    [studyModule?.courses],
  )

  if (!studyModule) {
    return <ModuleSkeleton {...props} />
  }

  return (
    <ModuleContainer id={studyModule.slug}>
      <ModuleDisplayBackground
        backgroundColor={backgroundColor}
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      >
        <ModuleDisplayContent
          name={studyModule.name}
          description={studyModule.description ?? ""}
          orderedCourses={orderedCourses}
        />
      </ModuleDisplayBackground>
    </ModuleContainer>
  )
}

function ModuleSkeleton(props: ModuleProps) {
  const { hueRotateAngle, brightness, backgroundColor } = props

  return (
    <ModuleContainer>
      <ModuleDisplayBackground
        backgroundColor={backgroundColor}
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      >
        <ModuleDisplaySkeleton />
      </ModuleDisplayBackground>
    </ModuleContainer>
  )
}

export default Module
