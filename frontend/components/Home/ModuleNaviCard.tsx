import React from "react"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import styled from "styled-components"
import LangLink from "/components/LangLink"
import Skeleton from "@material-ui/lab/Skeleton"
import { AllModules_study_modules } from "/static/types/generated/AllModules"
import ModuleImage from "/components/Home/ModuleImage"
import { CardTitle } from "/components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import { FullCoverTextBackground } from "/components/Images/CardBackgroundFullCover"

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

const ModuleNaviCard = ({ module }: { module?: AllModules_study_modules }) => (
  <Grid item xs={12} md={6} lg={6}>
    <LangLink href={`#${module ? module.slug : ""}`}>
      <Base focusRipple>
        {module ? (
          <>
            <ModuleImage module={module} />
            <FullCoverTextBackground style={{ width: "70%" }}>
              <CardTitle variant="h3" component="h3" align="left">
                {module.name}
              </CardTitle>
              <CardText component="p" variant="body1" align="left">
                {module.description}
              </CardText>
            </FullCoverTextBackground>
          </>
        ) : (
          <>
            <FullCoverTextBackground style={{ width: "70%" }}>
              <SkeletonTitle width="100%" />
              <SkeletonBodyText variant="text" />
            </FullCoverTextBackground>
          </>
        )}
      </Base>
    </LangLink>
  </Grid>
)

export default ModuleNaviCard
