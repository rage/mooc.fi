import Module from "./ModuleDisplay/ModuleDisplay"
import PartnerDivider from "/components/PartnerDivider"
import LUT from "/public/md_pages/modules/lut_module.mdx"

import {
  FrontpageCourseFieldsFragment,
  StudyModuleFieldsFragment,
} from "/graphql/generated"

type StudyModuleWithFrontpageCourse = StudyModuleFieldsFragment & {
  courses: Array<FrontpageCourseFieldsFragment>
}

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
      studyModule: StudyModuleWithFrontpageCourse
    }
  | {
      type: "custom-module"
      id?: string
      studyModule: React.JSX.Element
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
    studyModule: <LUT />,
  },
]

interface ModuleListProps {
  studyModules: Array<StudyModuleWithFrontpageCourse>
  loading: boolean
}

const ModuleList = ({ studyModules, loading }: ModuleListProps) => {
  if (loading) {
    return <Module key="skeletonmodule" {...moduleColors[0]} />
  }

  let moduleComponentList: Array<ModuleComponent> = studyModules.map(
    (studyModule) => ({
      type: "module",
      studyModule,
    }),
  )

  moduleComponentList = moduleComponentList.concat(customModuleComponents)

  return (
    <>
      {moduleComponentList.map((component, idx) => {
        if (component.type === "module") {
          return (
            <Module
              key={component.studyModule.id}
              studyModule={component.studyModule}
              {...moduleColors[idx % moduleColors.length]}
            />
          )
        }
        if (component.type === "divider") {
          return (
            <PartnerDivider key="divider" style={{ padding: "0 0.5rem" }} />
          )
        }

        if (component.type === "custom-module") {
          return component.id ? (
            <section id={component.id} key={component.id}>
              {component.studyModule}
            </section>
          ) : (
            component.studyModule
          )
        }
      })}
    </>
  )
}

export default ModuleList
