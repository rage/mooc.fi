declare module "*.svg?icon" {
  import { FunctionComponent, SVGProps } from "react"
  import { SerializedStyles } from "@mui/styled-engine"

  const GraphicSvg: FunctionComponent<
    SVGProps<SVGSVGElement> & { css?: SerializedStyles }
  >

  export default GraphicSvg
}
