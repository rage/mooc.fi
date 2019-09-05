import React from "react"
import styled from "styled-components"
import Typography from "@material-ui/core/Typography"
import Skeleton from "@material-ui/lab/Skeleton"
import { AllModules_study_modules_with_courses } from "/static/types/moduleTypes"
import ModuleImage from "/components/Home/ModuleImage"

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

const SkeletonBackground = styled(Skeleton)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: -2;
`

const ModuleBanner = ({
  module,
}: {
  module?: AllModules_study_modules_with_courses
}) => (
  <ModuleBannerContainer>
    {module ? (
      <>
        <Title component="h2" variant="h2" align="center">
          {module.name}
        </Title>
        <ModuleImage module={module} />
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

export default ModuleBanner
