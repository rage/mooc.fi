import React from "react"
import { Grid, Typography, Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import AddIcon from "@material-ui/icons/Add"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import { ObjectifiedModule } from "./../static/types/moduleTypes"
import styled from "styled-components"
import LangLink from "/components/LangLink"

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
`
const NaviCardBodyText = styled(Typography)`
  max-width: 60%;
  text-align: left;
  margin: 0;
  margin-left: 1rem;
  flex: 1;
  position: absolute;
  bottom: 20px;
  width: 100%;
  @media (min-width: 320px) {
    font-size: 18px;
  }
  @media (min-width: 420px) {
    font-size: 20px;
  }
  @media (min-width: 720px) {
    font-size: 24px;
  }
  @media (min-width: 1000px) {
    font-size: 24px;
  }
`

function ModuleCard({ module }: { module?: ObjectifiedModule }) {
  const imageUrl = module
    ? module.image
      ? `/static/images/${module.image}`
      : `/static/images/${module.slug}.jpg`
    : "" // TODO: placeholder

  //  require(`/static/images/courseimages/${course.slug}.png`)
  // removed doggos as a placeholder for the time being

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Base>
        {module ? (
          <ImageBackground style={{ backgroundImage: `url(${imageUrl})` }} />
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
          <NaviCardBodyText paragraph>
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
          </NaviCardBodyText>
        </ContentArea>
      </Base>
    </Grid>
  )
}

export default ModuleCard
