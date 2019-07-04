import React from "react"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const BannerRoot = styled.section`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  min-height: 450px;
`
const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`
const Title = styled(Typography)`
  margin-top: 2rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  @media (min-width: 320px) {
    font-size: 46px;
  }
  @media (min-width: 600px) {
    font-size: 56px;
  }
  @media (min-width: 960px) {
    font-size: 72px;
  }
`
const Subtitle = styled(Typography)`
  margin-left: 2rem;
  width: 55%;
  @media (min-width: 320px) {
    font-size: 22px;
  }
  @media (min-width: 600px) {
    font-size: 28px;
  }
  @media (min-width: 960px) {
    font-size: 32px;
  }
`

function ImageBanner({ image, title, subtitle }) {
  return (
    <BannerRoot>
      <Title component="h2">{title}</Title>
      <Subtitle component="p">{subtitle}</Subtitle>
      <BackgroundImage srcSet={image.srcSet} src={image.src} alt="" />
    </BannerRoot>
  )
}

export default ImageBanner
