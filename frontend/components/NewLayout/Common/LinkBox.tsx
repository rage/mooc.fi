import React from "react"

import Image, { ImageProps } from "next/image"

import { PropsOf } from "@emotion/react"
import { Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import CTALink, { CTALinkProps } from "./CTALink"
import { FullCoverTextBackground } from "/components/Images/CardBackgroundFullCover"
import { fontSize } from "/src/theme/util"

const LinkBoxContainer = styled("article")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.backgroundBox};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  }
`,
)

const LinkBoxContainerNonClickable = styled("article")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.backgroundBox};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
`,
)

const LinkBoxContent = styled("div")`
  /* */
`

const LinkBoxImageContainer = styled("div")`
  margin: 0;
  display: flex;
  justify-content: stretch;
  min-height: 10rem;
  position: relative;

  &:before {
    content: "";
    display: block;
    padding-top: calc(10 / 16) * 100%;
    width: 100%;
  }
`

const LinkBoxImage = styled(Image)`
  bottom: 0;
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
`

const LinkBoxTitleImageContainer = styled("div")`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const LinkBoxTitleImage = styled(Image)`
  object-fit: contain;
`

const LinkBoxTextContainer = styled("div")`
  padding: 16px;
`

const LinkBoxTitle = styled(Typography)(
  ({ theme }) => `
  ${fontSize(21, 28)}
  font-weight: 700;
  color: ${theme.palette.common.brand.nearlyBlack};
  letter-spacing: -0.42px;
  hyphens: auto;
  margin: 0 0 16px;

  ${theme.breakpoints.up("desktop")} {
    ${fontSize(25, 32)}
    letter-spacing: -0.5px;
  }
`,
)

const LinkBoxDescription = styled("p")(
  ({ theme }) => `
  ${fontSize(15, 22)};
  color: ${theme.palette.common.grayscale.black};
  margin: 0;

  ${theme.breakpoints.up("desktop")} {
    ${fontSize(17, 26)}
  }
`,
)

const LinkBoxLink = styled(CTALink)`
  margin: 0 -8px 24px 0;
  align-self: flex-end;
  padding-left: 2rem;

  span[aria-hidden="true"] {
    position: absolute;
    inset: 0;
  }

  &:focus {
    outline: none;
  }
` as typeof CTALink

const FlagBackground = styled(FullCoverTextBackground)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 100%;
  padding: 0 1rem;
  background-color: #ffd700;
  z-index: 2;
  background-image: linear-gradient(90deg, transparent 20px, white 20px),
    linear-gradient(180deg, #0057b7 50%, #ffd700 50%);
  background-repeat: no-repeat;
  gap: 1rem;
`

export interface LinkBoxProps {
  imageProps?: ImageProps
  title: string
  titleImageProps?: ImageProps
  description?: string
  linkProps?: CTALinkProps
  ukraine?: boolean
}

const LinkBoxContents = ({
  imageProps,
  titleImageProps,
  title,
  description,
}: LinkBoxProps & PropsOf<typeof LinkBoxContainer>) => (
  <LinkBoxContent>
    {imageProps && (
      <LinkBoxImageContainer>
        <LinkBoxImage {...imageProps} />
      </LinkBoxImageContainer>
    )}
    <LinkBoxTextContainer>
      {titleImageProps ? (
        <LinkBoxTitleImageContainer>
          <LinkBoxTitleImage {...titleImageProps} />
        </LinkBoxTitleImageContainer>
      ) : (
        <LinkBoxTitle variant="h3">{title}</LinkBoxTitle>
      )}
      {description && <LinkBoxDescription>{description}</LinkBoxDescription>}
    </LinkBoxTextContainer>
  </LinkBoxContent>
)

const LinkBox = ({
  imageProps,
  title,
  description,
  titleImageProps,
  linkProps,
  ukraine,
  ...props
}: LinkBoxProps & PropsOf<typeof LinkBoxContainer>) => {
  return linkProps ? (
    ukraine ? (
      <FlagBackground>
        <LinkBoxContainer {...props}>
          <LinkBoxContents
            imageProps={imageProps}
            titleImageProps={titleImageProps}
            title={title}
            description={description}
          />
          <LinkBoxLink {...linkProps}></LinkBoxLink>
        </LinkBoxContainer>
      </FlagBackground>
    ) : (
      <LinkBoxContainer {...props}>
        <LinkBoxContents
          imageProps={imageProps}
          titleImageProps={titleImageProps}
          title={title}
          description={description}
        />
        <LinkBoxLink {...linkProps}></LinkBoxLink>
      </LinkBoxContainer>
    )
  ) : (
    <LinkBoxContainerNonClickable {...props}>
      <LinkBoxContents
        imageProps={imageProps}
        titleImageProps={titleImageProps}
        title={title}
        description={description}
      />
    </LinkBoxContainerNonClickable>
  )
}

interface LinkBoxSkeletonProps extends PropsOf<typeof LinkBoxContainer> {
  hasImage?: boolean
  hasDescription?: boolean
}

export const LinkBoxSkeleton = ({
  hasImage,
  hasDescription,
  ...props
}: LinkBoxSkeletonProps) => (
  <LinkBoxContainer {...props}>
    <LinkBoxContent>
      {hasImage && (
        <LinkBoxImageContainer>
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </LinkBoxImageContainer>
      )}
      <LinkBoxTextContainer>
        <LinkBoxTitle variant="h3">
          <Skeleton variant="text" width={200} />
        </LinkBoxTitle>
        {hasDescription && (
          <LinkBoxDescription>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="40%" />
          </LinkBoxDescription>
        )}
      </LinkBoxTextContainer>
    </LinkBoxContent>
  </LinkBoxContainer>
)
export default LinkBox
