import React from "react"
import { Grid, Typography } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import AddIcon from "@material-ui/icons/Add"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import styled from "styled-components"
import { mime } from "/util/imageUtils"
import LangLink from "/components/LangLink"
import { AllEditorModulesWithTranslations_study_modules } from "/static/types/generated/AllEditorModulesWithTranslations"
import { ClickableDiv } from "/components/Surfaces/ClickableCard"
import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"

const Base = styled(ClickableDiv)`
  width: 100%;
  overflow: hidden;
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

const IconBackground = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
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

const NaviCardTitle = styled(Typography)`
  margin-bottom: 1rem;
  margin-left: 1rem;
  max-width: 60%;
  line-height: 1.2em;
  @media (min-width: 320px) {
    font-size: 26px;
  }
  @media (min-width: 420px) {
    font-size: 32px;
  }
  @media (min-width: 720px) {
    font-size: 46px;
  }
  @media (min-width: 720px) {
    font-size: 48px;
  }
  flex: 1;
`

function ModuleCard({
  module,
}: {
  module?: AllEditorModulesWithTranslations_study_modules
}) {
  const imageUrl = module
    ? module.image
      ? `../../static/images/${module.image}`
      : `../../static/images/${module.slug}.jpg`
    : "" // TODO: placeholder

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Base>
        {module ? (
          <picture>
            <source srcSet={`${imageUrl}?webp`} type="image/webp" />
            <source srcSet={imageUrl} type={mime(imageUrl)} />
            <ImageBackground style={{ backgroundImage: `url(${imageUrl})` }} />
          </picture>
        ) : (
          <IconBackground>
            <AddCircleIcon
              style={{
                color: "rgba(100,100,255)",
                width: "100%",
                height: "100%",
              }}
            />
          </IconBackground>
        )}
        <ImageCover />
        <ContentArea>
          <NaviCardTitle align="left">
            {module ? module.name : "New module"}
          </NaviCardTitle>

          {module ? (
            <LangLink href={`/study-modules/${module.slug}/edit`}>
              <a>
                <ButtonWithPaddingAndMargin
                  variant="text"
                  color="secondary"
                  style={{ width: "68%" }}
                >
                  <EditIcon />
                  Edit
                </ButtonWithPaddingAndMargin>
              </a>
            </LangLink>
          ) : (
            <LangLink href={`/study-modules/new`}>
              <a>
                <ButtonWithPaddingAndMargin
                  variant="text"
                  color="secondary"
                  style={{ width: "68%" }}
                >
                  <AddIcon />
                  Create
                </ButtonWithPaddingAndMargin>
              </a>
            </LangLink>
          )}
        </ContentArea>
      </Base>
    </Grid>
  )
}

export default ModuleCard
