import { ClickableDiv, ShadowedDiv } from "components/Surfaces/ClickableCard"
import { CardTitle } from "components/Text/headers"
import Image from "next/image"

import { Button, EnhancedLink, Grid, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

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

const NaviItemBaseNonClickable = styled(ShadowedDiv)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-start;
`

const NoLinkContainer = styled("div")`
  height: 100%;
`

const NaviItemTextBackground = styled(FullCoverTextBackground)`
  width: 100%;
`

const NaviItemCardTitle = styled(CardTitle)`
  max-width: 70%;
` as typeof CardTitle

const NaviItemCardText = styled(CardText)`
  max-width: 70%;
  flex: 1;
` as typeof CardText

const TitleImage = styled(Image)`
  width: 70%;
`

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
` as EnhancedLink

type NaviItem = {
  title: string
  text: string
  linkText?: string
  img?: string
  link?: string
  titleImg?: string
}

interface NaviCardProps {
  item: NaviItem
  count?: number
}

const gridLayout = (count: number): { [key: string]: number } =>
  count % 2 === 1
    ? {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4,
      }
    : {
        xs: 12,
        sm: 6,
        md: 6,
        lg: count <= 2 ? 6 : 3,
      }

function NaviCard(props: NaviCardProps) {
  const { item, count } = props
  const gridProps =
    count !== undefined
      ? gridLayout(count)
      : {
          xs: 12,
        }

  return (
    <Grid item {...gridProps}>
      {item.link && item.linkText ? (
        <StyledLink href={item.link} aria-label={item.linkText}>
          <NaviItemBase>
            {item.img ? (
              <BackgroundImage
                src={require(`/public/images/navi/${item.img}`)}
                placeholder="blur"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt=""
                fill
              />
            ) : null}
            <NaviItemTextBackground>
              <NaviItemCardTitle component="h2" variant="h3" align="left">
                {item.titleImg ? (
                  <TitleImage
                    src={require(`/public/images/navi/${item.titleImg}`)}
                    placeholder="blur"
                    priority
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  item.title
                )}
              </NaviItemCardTitle>
              <NaviItemCardText paragraph variant="body1" align="left">
                {item.text}
              </NaviItemCardText>
              {item.linkText ? (
                <Button fullWidth aria-disabled="true">
                  {item.linkText}
                </Button>
              ) : undefined}
            </NaviItemTextBackground>
          </NaviItemBase>
        </StyledLink>
      ) : (
        <NoLinkContainer>
          <NaviItemBaseNonClickable>
            {item.img ? (
              <BackgroundImage
                src={require(`/public/images/navi/${item.img}`)}
                placeholder="blur"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt=""
                fill
              />
            ) : null}
            <NaviItemTextBackground>
              <NaviItemCardTitle component="h2" variant="h3" align="left">
                {item.titleImg ? (
                  <TitleImage
                    src={require(`/public/images/navi/${item.titleImg}`)}
                    placeholder="blur"
                    priority
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  item.title
                )}
              </NaviItemCardTitle>
              <NaviItemCardText paragraph variant="body1" align="left">
                {item.text}
              </NaviItemCardText>
            </NaviItemTextBackground>
          </NaviItemBaseNonClickable>
        </NoLinkContainer>
      )}
    </Grid>
  )
}

export default NaviCard
