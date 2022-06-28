import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"
import ModuleDisplayContent from "/components/Home/ModuleDisplay/ModuleDisplayContent"
import ModuleDisplaySkeleton from "/components/Home/ModuleDisplay/ModuleDisplaySkeleton"
import { CourseStatus } from "/static/types/generated/globalTypes"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import { orderBy } from "lodash"
import { useMemo } from "react"

interface ModuleProps {
  module?: AllModules_study_modules_with_courses
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function Module(props: ModuleProps) {
  const { module, hueRotateAngle, brightness, backgroundColor } = props
  const orderedCourses = useMemo(
    () =>
      orderBy(
        module?.courses || [],
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
