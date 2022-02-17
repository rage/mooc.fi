import { PropsWithChildren } from "react"

import { CenteredContent } from "/components/Home/ModuleDisplay/Common"
import CustomModuleContent from "/components/Home/ModuleDisplay/CustomModule/CustomModuleContent"
import ModuleDescription from "/components/Home/ModuleDisplay/ModuleDescription"
import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"

interface CustomModuleProps {
  name: string
  description: string | JSX.Element
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function CustomModule({
  name,
  description,
  backgroundColor,
  hueRotateAngle,
  brightness,
  children,
}: PropsWithChildren<CustomModuleProps>) {
  return (
    <section style={{ marginBottom: "3em" }}>
      <ModuleDisplayBackground
        backgroundColor={backgroundColor}
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      >
        <CenteredContent>
          <ModuleDescription name={name} description={description} />
          <CustomModuleContent>{children}</CustomModuleContent>
        </CenteredContent>
      </ModuleDisplayBackground>
    </section>
  )
}

export default CustomModule
