import CustomModule from "/components/Home/ModuleDisplay/CustomModule"
import LUTContent from "/static/md_pages/lut_content.mdx"
import LUTDescription from "/static/md_pages/lut_description.mdx"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"

import Module from "./ModuleDisplay/ModuleDisplay"

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

type ModuleComponent =
  | {
      type: "module"
      module: AllModules_study_modules_with_courses
    }
  | {
      type: "custom-module"
      name: string
      description: string | JSX.Element
      children: JSX.Element
    }

const ModuleList = ({
  modules,
  loading,
}: {
  modules: AllModules_study_modules_with_courses[]
  loading: boolean
}) => {
  if (loading) {
    ;<Module key="skeletonmodule" {...moduleColors[0]} />
  }

  const moduleComponentList: Array<ModuleComponent> = modules.map((module) => ({
    type: "module",
    module,
  }))

  moduleComponentList.push({
    type: "custom-module",
    name: "LUT",
    description: <LUTDescription />,
    children: <LUTContent />,
  })

  return (
    <>
      {moduleComponentList.map((component, idx) => {
        if (component.type === "module") {
          return (
            <Module
              key={`module-list-module-${component.module.id}`}
              module={component.module}
              {...moduleColors[idx % moduleColors.length]}
            />
          )
        } else {
          return (
            <CustomModule
              name={component.name}
              description={component.description}
              {...moduleColors[idx % moduleColors.length]}
            >
              {component.children}
            </CustomModule>
          )
        }
      })}
    </>
  )
}

export default ModuleList
