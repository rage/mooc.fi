import { PropsWithChildren } from "react"

import { CenteredContent } from "/components/Home/ModuleDisplay/Common"
import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"

interface CustomModuleProps {
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
}

function CustomModule({
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
        <CenteredContent>{children}</CenteredContent>
      </ModuleDisplayBackground>
    </section>
  )
}

export default CustomModule
