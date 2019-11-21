import React from "react"
import { Grid, Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import AddIcon from "@material-ui/icons/Add"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import styled from "styled-components"
import { mime } from "/util/imageUtils"
import LangLink from "/components/LangLink"
import { AllEditorModulesWithTranslations_study_modules } from "/static/types/generated/AllEditorModulesWithTranslations"
import { CardTitle } from "/components/Text/headers"

const Base = styled.div`
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
          <CardTitle component="h2" variant="h3" align="left">
            {module ? module.name : "New module"}
          </CardTitle>

          {module ? (
            <LangLink href={`/study-modules/${module.slug}/edit`}>
              <a>
                <Button variant="contained" color="secondary" fullWidth>
                  <EditIcon />
                  Edit
                </Button>
              </a>
            </LangLink>
          ) : (
            <LangLink href={`/study-modules/new`}>
              <a>
                <Button variant="contained" color="secondary" fullWidth>
                  <AddIcon />
                  Create
                </Button>
              </a>
            </LangLink>
          )}
        </ContentArea>
      </Base>
    </Grid>
  )
}

export default ModuleCard
