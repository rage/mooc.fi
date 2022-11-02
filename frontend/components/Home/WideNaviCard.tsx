import { ClickableDiv } from "components/Surfaces/ClickableCard"
import { CardTitle } from "components/Text/headers"
import Image from "next/image"
import Link from "next/link"

import styled from "@emotion/styled"
import { Button } from "@mui/material"
import Grid from "@mui/material/Grid"

import {
  BackgroundImage,
  FullCoverTextBackground,
} from "/components/Images/CardBackgroundFullCover"
import { CardText } from "/components/Text/paragraphs"

const NaviItemBase = styled(ClickableDiv)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-start;
`

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
`

type NaviItem = {
  title?: string
  text: string
  linkText: string
  img?: string
  imgDimensions?: { width: number; height: number }
  link: string
  titleImg?: string
  titleImgDimensions?: { width: number; height: number }
}

interface NaviCardProps {
  item: NaviItem
}

const Background = styled(FullCoverTextBackground)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-areas: "title text button";
  grid-gap: 1rem;
  align-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-areas: "title title title" "text text button";
  }
`

const TitleImage = styled(Image)``

const TitleImageContainer = styled.div`
  position: relative;
  width: 70%;
`

function WideNaviCard(props: NaviCardProps) {
  const { item } = props

  return (
    <Grid item xs={12}>
      <StyledLink href={item.link} prefetch={false} aria-label={item.linkText}>
        <NaviItemBase>
          {item.img && (
            <BackgroundImage
              src={`/static/images/${item.img}`}
              loading="lazy"
              alt=""
              aria-hidden
              {...(item.imgDimensions ?? { fill: true })}
            />
          )}
          <Background>
            {item.titleImg ? (
              <TitleImageContainer>
                <TitleImage
                  src={`/static/images/${item.titleImg}`}
                  alt={item.title ?? ""}
                  style={{ objectFit: "contain", gridArea: "title" }}
                  {...(item.titleImgDimensions ?? { fill: true })}
                />
              </TitleImageContainer>
            ) : (
              <CardTitle
                component="h2"
                variant="h3"
                align="left"
                style={{ maxWidth: "70%", gridArea: "title" }}
              >
                {item.title}
              </CardTitle>
            )}
            <CardText
              component="p"
              variant="body1"
              align="left"
              style={{ minWidth: "70%", flex: 1, gridArea: "text" }}
            >
              {item.text}
            </CardText>
            {item.linkText && (
              <Button
                aria-disabled="true"
                style={{ maxHeight: "37px", gridArea: "button" }}
              >
                {item.linkText}
              </Button>
            )}
          </Background>
        </NaviItemBase>
      </StyledLink>
    </Grid>
  )
}

export default WideNaviCard
