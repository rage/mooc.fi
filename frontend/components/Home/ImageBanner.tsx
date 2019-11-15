import React from "react"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const BannerRoot = styled.section`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  min-height: 200px;
  max-height: 350px;
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
  font-family: "Open Sans Condensed", sans-serif !important;
  @media (min-width: 320px) {
    font-size: 46px;
  }
  @media (min-width: 600px) {
    font-size: 56px;
  }
  @media (min-width: 960px) {
    font-size: 72px;
  }
  background-color: rgba(255, 255, 255, 0.8);
  width: 45%;
  margin: auto;
`

interface ImageBannerProps {
  image: any
  title: string
}

function ImageBanner(props: ImageBannerProps) {
  const { image, title } = props
  return (
    <BannerRoot>
      <Title component="h2" align="center">
        {title}
      </Title>
      <BackgroundImage src={image} alt="" />
    </BannerRoot>
  )
}

export default ImageBanner
