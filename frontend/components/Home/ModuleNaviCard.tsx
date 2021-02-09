import styled from "@emotion/styled"
import LangLink from "/components/LangLink"
import { Skeleton } from "@material-ui/core"
import { AllModules_study_modules } from "/static/types/generated/AllModules"

import ModuleImage from "/components/Home/ModuleImage"

import { CardTitle } from "/components/Text/headers"

import { CardText } from "/components/Text/paragraphs"

import { FullCoverTextBackground } from "/components/Images/CardBackgroundFullCover"
import { ClickableButtonBase } from "/components/Surfaces/ClickableCard"

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

const Base = styled(ClickableButtonBase)<{ component: any }>`
  display: block;
  width: 100%;
  height: 100%;
  background-color: transparent;
`

const TextBackground = styled(FullCoverTextBackground)`
  width: 70%;
`

const GridItem = styled.div`
  width: 100%;
  /* Basic styles for browsers without css grid support */
  margin: 0 auto;
  margin-bottom: 1rem;
  @supports (display: grid) {
    margin-bottom: 0;
  }
`

const ModuleNaviCard = ({ module }: { module?: AllModules_study_modules }) => (
  <GridItem>
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
  </GridItem>
)

export default ModuleNaviCard
