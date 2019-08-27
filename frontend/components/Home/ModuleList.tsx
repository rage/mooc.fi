import React from "react"
import Module from "./Module"
import { ObjectifiedModule } from "/static/types/moduleTypes"

const moduleColors: Array<{
  backgroundColor: string
  hueRotateAngle: number
  brightness: number
}> = [
  {
    backgroundColor: "#00a68d",
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
  modules: ObjectifiedModule[]
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
          {...moduleColors[idx]}
        />
      ))}
    </>
  )

export default ModuleList
