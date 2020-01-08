import React, { useMemo } from "react"
import { Grid } from "@material-ui/core"
import styled from "styled-components"
import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
//@ts-ignore
import Skeleton from "@material-ui/lab/Skeleton"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import { orderBy } from "lodash"
import { CourseStatus } from "/static/types/generated/globalTypes"
import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"
import ModuleDescription from "/components/Home/ModuleDisplay/ModuleDescription"

const ContentContainer = styled.div`
  position: relative;
  margin: 1rem;
`

interface ModuleProps {
  module?: AllModules_study_modules_with_courses
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function Module(props: ModuleProps) {
  const { module, hueRotateAngle, brightness, backgroundColor } = props

  const orderedCourses = module
    ? useMemo(
        () =>
          orderBy(module.courses || [], [
            course => course.study_module_start_point !== true,
            course => course.status === CourseStatus.Upcoming,
          ]),
        [module.courses],
      )
    : []

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
        {module && (
          <ModuleDescription
            name={module.name}
            description={module.description}
          />
        )}
        <ContentContainer style={{ width: "60%" }}>
          <Grid container spacing={3}>
            {module ? (
              orderedCourses.map(course => (
                <ModuleSmallCourseCard
                  key={`module-course-${course.id}`}
                  course={course}
                  showHeader={true}
                />
              ))
            ) : (
              <>
                <ModuleSmallCourseCard key="module-course-skeleton1" />
                <ModuleSmallCourseCard key="module-course-skeleton2" />
              </>
            )}
          </Grid>
        </ContentContainer>
      </ModuleDisplayBackground>
    </section>
  )
}

export default Module

/* <ContentContainer style={{ width: "40%" }}>
          <ModuleHeader
            component="h2"
            variant="h2"
            align="left"
            fontcolor="white"
            titlebackground={backgroundColor}
          >
            {module ? module.name : <Skeleton variant="text" />}
          </ModuleHeader>
          {module ? (
            <ModuleDescription variant="subtitle1">
              {module.description}
            </ModuleDescription>
          ) : (
            <Skeleton />
          )}
        </ContentContainer>*/
