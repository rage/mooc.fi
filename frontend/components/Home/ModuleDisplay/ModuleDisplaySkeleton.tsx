import React from "react"
import Skeleton from "@material-ui/lab/Skeleton"
import ModuleSmallCourseCard from "../ModuleSmallCourseCard"
import { ContentContainer } from "/components/Home/ModuleDisplay/ModuleDescription"

const ModuleDisplaySkeleton = () => {
  return (
    <>
      <ContentContainer style={{ width: "40%" }}>
        <Skeleton />
        <Skeleton variant="text" />
      </ContentContainer>
      <ContentContainer style={{ width: "60%" }}>
        <ModuleSmallCourseCard key="module-course-skeleton1" />
        <ModuleSmallCourseCard key="module-course-skeleton2" />
      </ContentContainer>
    </>
  )
}

export default ModuleDisplaySkeleton
