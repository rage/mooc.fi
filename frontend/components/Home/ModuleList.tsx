import React from "react"
import Module from "./ModuleDisplay/ModuleDisplay"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"

const moduleColors: Array<{
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
}> = [
  {
    backgroundColor: "#265A6C",
    hueRotateAngle: 0,
    brightness: 2,
  },
  {
    backgroundColor: "#7748A4",
    hueRotateAngle: 60,
    brightness: 5,
  },
  {
    backgroundColor: "#0D5F6D",
    hueRotateAngle: 0,
    brightness: 2,
  },
  {
    backgroundColor: "#bbeffb",
    hueRotateAngle: 32,
    brightness: 0.5,
  },
]

const ModuleList = ({
  modules,
  loading,
}: {
  modules: AllModules_study_modules_with_courses[]
  loading: boolean
}) =>
  loading ? (
    <Module key="skeletonmodule" {...moduleColors[0]} />
  ) : (
    <>
      {modules.map((module, idx) => (
        <Module
          key={`module-list-module-${module.id}`}
          module={module}
          {...moduleColors[idx % moduleColors.length]}
        />
      ))}
    </>
  )

export default ModuleList
