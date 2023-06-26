import { ImageProps } from "next/image"

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
import LoaderImage from "/components/LoaderImage"
import { ClickableDiv } from "/components/Surfaces/ClickableCard"
import { useTranslator } from "/hooks/useTranslator"
import StudyModulesTranslations from "/translations/study-modules"

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

const ImageBackground = styled(LoaderImage)`
  ${ImageBackgroundBase.styles};
  object-fit: cover;
`

const ImageBackgroundSkeleton = styled("span")`
  ${ImageBackgroundBase.styles}
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

const AddCourseIcon = styled(AddCircleIcon)`
  color: rgba(100, 100, 255);
  width: 100%;
  height: 100%;
`

const ModuleButton = styled(ButtonWithPaddingAndMargin)`
  width: 68%;
`

interface ModuleCardProps {
  studyModule?: StudyModuleDetailedFieldsFragment
  image?: Exclude<ImageProps["src"], string>
  loading?: boolean
}

function ModuleCard({ studyModule, image, loading }: ModuleCardProps) {
  const t = useTranslator(StudyModulesTranslations)
  const moduleFound = !loading && studyModule
  const moduleNotFound = !loading && !studyModule

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Base>
        {loading && (
          <ImageBackgroundSkeleton>
            <Skeleton variant="rectangular" height="100%" />
          </ImageBackgroundSkeleton>
        )}
        {moduleFound && (
          <ImageBackground
            src={image}
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt=""
            aria-hidden="true"
            fill
          />
        )}
        {moduleNotFound && (
          <IconBackground>
            <AddCourseIcon />
          </IconBackground>
        )}
        <ImageCover />
        <ContentArea>
          {loading ? (
            <NaviCardTitle align="left">
              <Skeleton variant="text" />
            </NaviCardTitle>
          ) : (
            <NaviCardTitle align="left">
              {studyModule ? studyModule.name : t("newStudyModule")}
            </NaviCardTitle>
          )}

          {loading && (
            <ModuleButton variant="text" color="secondary">
              <Skeleton variant="text" width="100%" />
            </ModuleButton>
          )}
          {moduleFound && (
            <ModuleButton
              href={`/study-modules/${studyModule.slug}/edit`}
              aria-label={t("editStudyModule")}
              variant="text"
              color="secondary"
            >
              <EditIcon />
              {t("edit")}
            </ModuleButton>
          )}
          {moduleNotFound && (
            <ModuleButton
              href={`/study-modules/new`}
              aria-label={t("newStudyModule")}
              variant="text"
              color="secondary"
            >
              <AddIcon />
              {t("create")}
            </ModuleButton>
          )}
        </ContentArea>
      </Base>
    </Grid>
  )
}

export default ModuleCard
