import React from "react"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { ObjectifiedModule } from "../../static/types/moduleTypes"
import LangLink from "/components/LangLink"
import Skeleton from "@material-ui/lab/Skeleton"
import mime from "mime-types"

const Base = styled(ButtonBase)`
  position: relative;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  height: 200px;
  @media (min-width: 720px) {
    height: 300px;
  }
`
const ImageBackground = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center 40%;
`
const ImageCover = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  opacity: 0.9;
  width: 70%;
`
const ContentArea = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: left;
  display: flex;
  flex-direction: column;
  padding-bottom: 1em;
  padding-top: 1em;
`

const TitleStyle = `
  margin-bottom: 1rem;
  margin-left: 1rem;
  max-width: 60%;
  line-height: 1.2em;
  @media (min-width: 320px) {
    font-size: 22px;
  }
  @media (min-width: 420px) {
    font-size: 28px;
  }
  @media (min-width: 720px) {
    font-size: 38px;
  }
  @media (min-width: 720px) {
    font-size: 40px;
  }
`

const NaviCardTitle = styled(Typography)`
  ${TitleStyle}
`
const SkeletonTitle = styled(Skeleton)`
  ${TitleStyle}
`

const BodyStyle = `
  max-width: 60%;
  text-align: left;
  margin: 0;
  margin-left: 1rem;
  flex: 1;
  @media (min-width: 320px) {
    font-size: 14px;
  }
  @media (min-width: 420px) {
    font-size: 16px;
  }
  @media (min-width: 720px) {
    font-size: 18px;
  }
  @media (min-width: 1000px) {
    font-size: 20px;
  }
`
const NaviCardBodyText = styled(Typography)`
  ${BodyStyle}
`

const SkeletonBodyText = styled(Skeleton)`
  ${BodyStyle}
`

const ModuleNaviCard = ({ module }: { module?: ObjectifiedModule }) => {
  const imageUrl = module
    ? module.image
      ? `../../static/images/${module.image}`
      : `../../static/images/${module.slug}.jpg`
    : ""

  return (
    <Grid item xs={12} md={6} lg={6}>
      <LangLink href={`#${module ? module.slug : ""}`}>
        <Base focusRipple>
          {module ? (
            <>
              <picture>
                <source
                  srcSet={imageUrl}
                  type={mime.lookup(imageUrl) || "image/jpeg"}
                />
                <source srcSet={`${imageUrl}?webp`} type="image/webp" />
                <ImageBackground
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              </picture>
              <ImageCover />
              <ContentArea>
                <NaviCardTitle align="left">{module.name}</NaviCardTitle>
                <NaviCardBodyText paragraph>
                  {module.description}
                </NaviCardBodyText>
              </ContentArea>
            </>
          ) : (
            <>
              <ImageCover />
              <ContentArea>
                <SkeletonTitle width="100%" />
                <SkeletonBodyText variant="text" />
              </ContentArea>
            </>
          )}
        </Base>
      </LangLink>
    </Grid>
  )
}

export default ModuleNaviCard
