import React from "react"
import Module from "./ModuleDisplay/ModuleDisplay"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"

const moduleColors: Array<{
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
}> = [
  {
    backgroundColor: "#4B577E",
    hueRotateAngle: 194,
    brightness: 2,
  },
  {
    backgroundColor: "#5F6F99",
    hueRotateAngle: 0,
    brightness: 2,
  },
  {
    backgroundColor: "#344A53",
    hueRotateAngle: 32,
    brightness: 0.5,
  },
  {
    backgroundColor: "#644C66",
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
