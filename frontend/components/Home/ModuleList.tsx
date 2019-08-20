import React from "react"
import Module from "./Module"
import { ObjectifiedModule } from "/static/types/moduleTypes"

const ModuleList = ({
  modules,
  loading,
}: {
  modules: ObjectifiedModule[]
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
