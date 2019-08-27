import React from "react"
import Module from "./Module"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"

const ModuleList = ({
  modules,
  loading,
}: {
  modules: AllModules_study_modules_with_courses[]
  loading: boolean
}) =>
  loading ? (
    <Module key="skeletonmodule" />
  ) : (
    <>
      {modules.map(module => (
        <Module key={`module-list-module-${module.id}`} module={module} />
      ))}
    </>
  )

export default ModuleList
