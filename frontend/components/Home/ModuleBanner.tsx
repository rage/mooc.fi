import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import Skeleton from "@material-ui/lab/Skeleton"
import { mime } from "/util/imageUtils"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"

const ModuleBannerContainer = styled.section`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  @media (min-width: 700px) {
    min-height: 300px;
  }
  @media (min-width: 1000px) {
    min-height: 350px;
  }
`

const Title = styled(Typography)`
  font-size: 38px;
  margin-top: 2rem;
  margin-left: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  width: 60%;
  @media (min-width: 425px) {
    font-size: 52px;
  }
  @media (min-width: 1000px) {
    font-size: 72px;
  }
`

const ImageBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -2;
  background-position: center;
`

const SkeletonBackground = styled(Skeleton)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -2;
`

function ModuleBanner({
  module,
}: {
  module?: AllModules_study_modules_with_courses
}) {
  const imageUrl = module
    ? module!.image
      ? `../../static/images/${module.image}`
      : `../../static/images/${module.slug}.jpg`
    : ""

  return (
    <ModuleBannerContainer>
      {module ? (
        <>
          <Title component="h2" variant="h2" align="center">
            {module.name}
          </Title>
          <picture>
            <source srcSet={imageUrl} type={mime(imageUrl)} />
            <source srcSet={`${imageUrl}?webp`} type="image/webp" />
            <ImageBackground style={{ backgroundImage: `url(${imageUrl}` }} />
          </picture>
        </>
      ) : (
        <>
          <Title component="h2" variant="h2" align="center">
            <Skeleton variant="text" />
          </Title>
          <SkeletonBackground variant="rect" height="100%" />
        </>
      )}
    </ModuleBannerContainer>
  )
}

export default ModuleBanner
