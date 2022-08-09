import { useMemo } from "react"

import { orderBy } from "lodash"

import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"
import ModuleDisplayContent from "/components/Home/ModuleDisplay/ModuleDisplayContent"
import ModuleDisplaySkeleton from "/components/Home/ModuleDisplay/ModuleDisplaySkeleton"
import notEmpty from "/util/notEmpty"

import {
  CourseStatus,
  StudyModuleFieldsWithCoursesFragment,
} from "/static/types/generated"

interface ModuleProps {
  module?: StudyModuleFieldsWithCoursesFragment
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function Module(props: ModuleProps) {
  const { module, hueRotateAngle, brightness, backgroundColor } = props

  const orderedCourses = useMemo(
    () =>
      orderBy(
        (module?.courses || []).filter(notEmpty),
        [
          (course) => course.study_module_order,
          (course) => course.study_module_start_point === true,
          (course) => course.status === CourseStatus.Active,
          (course) => course.status === CourseStatus.Upcoming,
        ],
        ["desc", "desc", "desc"],
      ),
    [module?.courses],
  )

  if (!module) {
    return null
  }

  return (
    <section
      id={module ? module.slug : "module-skeleton"}
      style={{ marginBottom: "3em" }}
    >
      <ModuleDisplayBackground
        backgroundColor={backgroundColor}
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      >
        {module ? (
          <ModuleDisplayContent
            name={module.name}
            description={module.description ?? ""}
            orderedCourses={orderedCourses}
          />
        ) : (
          <ModuleDisplaySkeleton />
        )}
      </ModuleDisplayBackground>
    </section>
  )
}

export default Module
