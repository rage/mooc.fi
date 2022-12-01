import { BoxProps, TypographyProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  CardTitle,
  H2NoBackground,
  SubtitleNoBackground,
} from "/components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { mime } from "/util/imageUtils"

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

const ModuleHeaderBase = styled(H2NoBackground)`
  color: white;
  margin-left: 0px;
  font-size: 72px;
  line-height: 100px;
  font-family: Open sans condensed, sans serif;
  font-weight: 300;
  @media (max-width: 490px) {
    font-size: 48px;
    line-height: 80px;
  }
  @media (max-width: 360px) {
    font-size: 37px;
    line-height: 70px;
  }
` as typeof H2NoBackground

export const ModuleHeader = ({
  children,
  ...props
}: TypographyProps & BoxProps) => (
  <ModuleHeaderBase component="h2" variant="h2" align="left" {...props}>
    {children}
  </ModuleHeaderBase>
)

const ModuleImageBase = styled("img")`
  width: 100%;
`

interface ModuleImageProps {
  src: string
  alt?: string
}

export const ModuleImage = ({ src, alt }: ModuleImageProps) => (
  <picture>
    <source
      srcSet={require(`../../../static/images/${src}?webp`)}
      type="image/webp"
    />
    <source
      srcSet={require(`../../../static/images/${src}`)}
      type={mime(src)}
    />
    <ModuleImageBase
      src={require(`../../../static/images/${src}`)}
      alt={alt}
      loading="lazy"
    />
  </picture>
)

const ModuleDescriptionTextBase = styled(SubtitleNoBackground)`
  color: white;
  font-size: 28px;
  line-height: 47px;
  @media (max-width: 360px) {
    font-size: 18px;
    line-height: 37px;
  }
` as typeof SubtitleNoBackground

export const ModuleDescriptionText = ({
  children,
  ...props
}: TypographyProps & BoxProps) => (
  <ModuleDescriptionTextBase variant="subtitle1" component="h3" {...props}>
    {children}
  </ModuleDescriptionTextBase>
)

export const ModuleCardTitle = ({
  children,
  ...props
}: TypographyProps & BoxProps) => (
  <CardTitle component="h3" align="center" variant="h3" {...props}>
    {children}
  </CardTitle>
)

export const ModuleCardText = ({
  children,
  ...props
}: TypographyProps & BoxProps) => (
  <CardText component="p" variant="body1" align="left" {...props}>
    {children}
  </CardText>
)
