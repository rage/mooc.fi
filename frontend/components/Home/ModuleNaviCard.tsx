import React from "react"
import Grid from "@material-ui/core/Grid"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import Skeleton from "@material-ui/lab/Skeleton"
import { AllModules_study_modules } from "/static/types/generated/AllModules"

import ModuleImage from "/components/Home/ModuleImage"

import { CardTitle } from "/components/Text/headers"

import { CardText } from "/components/Text/paragraphs"

import { FullCoverTextBackground } from "/components/Images/CardBackgroundFullCover"
import { ClicableButtonBase } from "/components/Surfaces/ClicableCard"

const SkeletonTitle = styled(Skeleton)`
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
`

const SkeletonBodyText = styled(Skeleton)`
  margin-bottom: 0.5rem;
  margin-top: 0.2rem;
`

const Base = styled(ClicableButtonBase)<{ component: any }>`
  display: block;
  width: 100%;
  height: 100%;
  background-color: transparent;
`

const TextBackground = styled(FullCoverTextBackground)`
  width: 70%;
`

const ModuleNaviCard = ({ module }: { module?: AllModules_study_modules }) => (
  <Grid item xs={12} md={6} lg={6}>
    <LangLink href={`#${module ? module.slug : ""}`}>
      <Base component="div">
        {module ? (
          <>
            <ModuleImage module={module} />
            <TextBackground>
              <CardTitle variant="h3" component="h3" align="left">
                {module.name}
              </CardTitle>
              <CardText component="p" variant="body1" align="left">
                {module.description}
              </CardText>
            </TextBackground>
          </>
        ) : (
          <>
            <TextBackground style={{ width: "70%" }}>
              <SkeletonTitle width="100%" />
              <SkeletonBodyText variant="text" />
            </TextBackground>
          </>
        )}
      </Base>
    </LangLink>
  </Grid>
)

export default ModuleNaviCard
