import { PropsWithChildren } from "react"

import { styled } from "@mui/material/styles"

import { CenteredContent } from "/components/Home/ModuleDisplay/Common"
import ModuleDisplayBackground from "/components/Home/ModuleDisplay/ModuleDisplayBackground"

interface CustomModuleProps {
  hueRotateAngle: number
  brightness: number
  backgroundColor: string
  id?: string
}

const CustomModuleSection = styled("section")`
  margin-bottom: 3em;
`

export function CustomModule({
  backgroundColor,
  hueRotateAngle,
  brightness,
  children,
  id,
}: PropsWithChildren<CustomModuleProps>) {
  return (
    <CustomModuleSection id={id}>
      <ModuleDisplayBackground
        backgroundColor={backgroundColor}
        hueRotateAngle={hueRotateAngle}
        brightness={brightness}
      >
        <CenteredContent>{children}</CenteredContent>
      </ModuleDisplayBackground>
    </CustomModuleSection>
  )
}
