import Image from "next/image"

import AddIcon from "@mui/icons-material/Add"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import EditIcon from "@mui/icons-material/Edit"
import {
  BoxProps,
  Grid,
  Skeleton,
  Typography,
  TypographyProps,
} from "@mui/material"
import { css, styled } from "@mui/material/styles"

import { ButtonWithPaddingAndMargin } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { ClickableDiv } from "/components/Surfaces/ClickableCard"

import { StudyModuleDetailedFieldsFragment } from "/graphql/generated"

const Base = styled(ClickableDiv)`
  width: 100%;
  overflow: hidden;
  height: 200px;
  @media (min-width: 720px) {
    height: 300px;
  }
`

const ImageBackgroundBase = css`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-size: cover;
  background-position: center 40%;
`

const ImageBackground = styled(Image)`
  ${ImageBackgroundBase};
  object-fit: cover;
`

const ImageBackgroundSkeleton = styled("span")`
  ${ImageBackgroundBase}
`

const IconBackground = styled("span")`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const ImageCover = styled("span")`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  opacity: 0.9;
  width: 70%;
`

const ContentArea = styled("span")`
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

const NaviCardTitle = styled(Typography)<TypographyProps & BoxProps>`
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

interface ModuleCardProps {
  module?: StudyModuleDetailedFieldsFragment
  loading?: boolean
}

function ModuleCard({ module, loading }: ModuleCardProps) {
  const imageUrl = module
    ? module.image
      ? `/images/modules/${module.image}`
      : `/images/modules/${module.slug}.jpg`
    : "" // TODO: placeholder
  const moduleFound = !loading && module
  const moduleNotFound = !loading && !module

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Base>
        {loading && (
          <ImageBackgroundSkeleton>
            <Skeleton variant="rectangular" height="100%" />
          </ImageBackgroundSkeleton>
        )}
        {moduleFound && (
          <ImageBackground src={imageUrl} alt="" aria-hidden="true" fill />
        )}
        {moduleNotFound && (
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
          {loading ? (
            <NaviCardTitle align="left" component="div">
              <Skeleton variant="text" />
            </NaviCardTitle>
          ) : (
            <NaviCardTitle align="left">
              {module ? module.name : "New module"}
            </NaviCardTitle>
          )}

          {loading && (
            <ButtonWithPaddingAndMargin
              variant="text"
              color="secondary"
              style={{ width: "68%" }}
            >
              <Skeleton variant="text" width="100%" />
            </ButtonWithPaddingAndMargin>
          )}
          {moduleFound && (
            <ButtonWithPaddingAndMargin
              href={`/study-modules/${module.slug}/edit`}
              aria-label={`Edit study module ${module.name}`}
              variant="text"
              color="secondary"
              style={{ width: "68%" }}
            >
              <EditIcon />
              Edit
            </ButtonWithPaddingAndMargin>
          )}
          {moduleNotFound && (
            <ButtonWithPaddingAndMargin
              href={`/study-modules/new`}
              aria-label="Create new study module"
              variant="text"
              color="secondary"
              style={{ width: "68%" }}
            >
              <AddIcon />
              Create
            </ButtonWithPaddingAndMargin>
          )}
        </ContentArea>
      </Base>
    </Grid>
  )
}

export default ModuleCard
