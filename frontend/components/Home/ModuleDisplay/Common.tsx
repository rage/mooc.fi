import Image, { ImageProps } from "next/image"

import { BoxProps, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  CardTitle,
  H2NoBackground,
  SubtitleNoBackground,
} from "/components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { staticSrc } from "/util/staticSrc"

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

export const ModuleHeader = styled(
  ({
    variant = "h2",
    component = "h2",
    align = "left",
    ...props
  }: TypographyProps & BoxProps) => (
    <H2NoBackground
      variant={variant}
      component={component}
      align={align}
      {...props}
    />
  ),
)<{
  component?: React.ElementType
}>`
  color: white;
  margin-left: 0px;
  font-size: 72px;
  line-height: 100px;
  font-family: var(--header-font), sans-serif;
  font-weight: 300;
  width: 100%;
  @media (max-width: 490px) {
    font-size: 48px;
    line-height: 80px;
  }
  @media (max-width: 360px) {
    font-size: 37px;
    line-height: 70px;
  }
` as typeof H2NoBackground

const ModuleImageContainer = styled("div")`
  position: relative;
  height: 100%;
`

export const ModuleImage = ({ src, alt, ...props }: ImageProps) => (
  <ModuleImageContainer>
    <Image
      src={staticSrc(src)}
      alt={alt ?? "Module image"}
      loading="lazy"
      style={{ objectFit: "contain" }}
      {...(!props.width && !props.height && { fill: true })}
      {...props}
    />
  </ModuleImageContainer>
)

export const ModuleDescriptionText = styled(
  ({
    variant = "subtitle1",
    component = "h3",
    ...props
  }: TypographyProps & BoxProps) => (
    <SubtitleNoBackground variant={variant} component={component} {...props} />
  ),
)`
  color: white;
  font-size: 28px;
  line-height: 47px;
  @media (max-width: 360px) {
    font-size: 18px;
    line-height: 37px;
  }
` as typeof SubtitleNoBackground

export const ModuleCardTitle = styled(
  ({
    variant = "h3",
    component = "h3",
    align = "center",
    ...props
  }: TypographyProps & BoxProps) => (
    <CardTitle
      variant={variant}
      component={component}
      align={align}
      {...props}
    />
  ),
)``

export const ModuleCardText = styled(
  ({
    variant = "body1",
    component = "p",
    align = "left",
    ...props
  }: TypographyProps & BoxProps) => (
    <CardText
      variant={variant}
      component={component}
      align={align}
      {...props}
    />
  ),
)``
