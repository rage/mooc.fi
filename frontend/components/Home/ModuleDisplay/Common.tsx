import { ImageProps } from "next/image"

import { BoxProps, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import ContainedImage from "/components/Images/ContainedImage"
import {
  CardTitle,
  H2NoBackground,
  SubtitleNoBackground,
} from "/components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { isStaticImport } from "/util/imageUtils"

export const CenteredContent = styled("div")`
  width: 80%;
  margin: auto;
  @supports (display: grid) {
    display: grid;
    grid-gap: 15px;
    align-content: space-around;
    grid-template-columns: 1fr;

    @media only screen and (min-width: 1200px) {
      grid-template-columns: 4.5fr 5.5fr;
      grid-auto-rows: 1fr;
      width: 90%;
    }
  }
`

export const ContentContainer = styled("div")`
  margin: 1rem;
  padding-left: 1rem;
  min-width: 33%;
`

export const ModuleHeader = styled(H2NoBackground)(
  ({ theme }) => `
  color: white;
  margin-left: 0px;
  font-size: 72px;
  line-height: 100px;
  font-family: var(--header-font), sans-serif;
  font-weight: 300;
  width: 100%;

  ${theme.breakpoints.down("sm")} {
    font-size: 48px;
    line-height: 80px;
  }
  ${theme.breakpoints.down("xs")} {
    font-size: 37px;
    line-height: 70px;
  }
`,
)

ModuleHeader.defaultProps = {
  variant: "h2",
  align: "left",
}

const ModuleImageContainer = styled("div")`
  position: relative;
  height: 100%;
`

export const ModuleImage = ({ src, alt, ...props }: ImageProps) => {
  const isStatic = isStaticImport(src)

  const imgSrc = isStatic ? src : require(`/public/images/modules/${src}`)

  return (
    <ModuleImageContainer>
      <ContainedImage
        src={imgSrc}
        placeholder="blur"
        alt={alt ?? "Module image"}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...(!props.width && !props.height && { fill: true })}
        {...props}
      />
    </ModuleImageContainer>
  )
}

const ModuleDescriptionTextStyled = styled(SubtitleNoBackground)(
  ({ theme }) => `
  color: white;
  font-size: 28px;
  line-height: 47px;
  ${theme.breakpoints.down("sm")} {
    font-size: 18px;
    line-height: 37px;
  }
`,
)

export const ModuleDescriptionText = (props: TypographyProps & BoxProps) => (
  <ModuleDescriptionTextStyled variant="subtitle1" component="h3" {...props} />
)

export const ModuleCardTitle = (props: TypographyProps & BoxProps) => (
  <CardTitle variant="h3" component="h3" align="center" {...props} />
)

export const ModuleCardText = (props: TypographyProps & BoxProps) => (
  <CardText variant="body1" component="p" align="left" {...props} />
)
