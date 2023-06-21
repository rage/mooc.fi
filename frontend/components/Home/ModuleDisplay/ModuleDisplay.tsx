import { useMemo } from "react"

import { sortBy } from "remeda"

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
      sortBy(
        studyModule?.courses ?? [],
        [
          (course) => course.study_module_order ?? Number.MAX_SAFE_INTEGER,
          "asc",
        ],
        [(course) => course.study_module_start_point === true, "desc"],
        [(course) => course.status === CourseStatus.Active, "desc"],
        [(course) => course.status === CourseStatus.Upcoming, "desc"],
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
