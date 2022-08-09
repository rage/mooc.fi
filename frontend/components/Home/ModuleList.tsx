import Module from "./ModuleDisplay/ModuleDisplay"
import PartnerDivider from "/components/PartnerDivider"

import LUT from "/static/md_pages/lut_module.mdx"
import { StudyModuleFieldsWithCoursesFragment } from "/static/types/generated"

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
      module: StudyModuleFieldsWithCoursesFragment
    }
  | {
      type: "custom-module"
      id?: string
      module: JSX.Element
    }
  | {
      type: "divider"
    }

const customModuleComponents: Array<ModuleComponent> = [
  {
    type: "divider",
  },
  {
    type: "custom-module",
    id: "lut",
    module: <LUT />,
  },
]

interface ModuleListProps {
  modules: StudyModuleFieldsWithCoursesFragment[]
  loading: boolean
}
const ModuleList = ({ modules, loading }: ModuleListProps) => {
  if (loading) {
    return <Module key="skeletonmodule" {...moduleColors[0]} />
  }

  let moduleComponentList: Array<ModuleComponent> = modules.map((module) => ({
    type: "module",
    module,
  }))

  moduleComponentList = moduleComponentList.concat(customModuleComponents)

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
        }
        if (component.type === "divider") {
          return (
            <PartnerDivider
              key={`divider-${idx}`}
              style={{ padding: "0 0.5rem 0 0.5rem" }}
            />
          )
        }

        if (component.type === "custom-module") {
          return component.id ? (
            <section
              id={component.id}
              key={`module-list-module-${component.id}`}
            >
              {component.module}
            </section>
          ) : (
            component.module
          )
        }
      })}
    </>
  )
}

export default ModuleList
