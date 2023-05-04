import { ClickableDiv } from "components/Surfaces/ClickableCard"
import { CardTitle } from "components/Text/headers"

import { Button, EnhancedLink, Grid, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import ContainedImage from "../Images/ContainedImage"
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
` as EnhancedLink

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

const TitleImageContainer = styled("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-area: title;
`

const WideNaviCardTitle = styled(CardTitle)`
  max-width: 70%;
  grid-area: title;
` as typeof CardTitle

const WideNaviCardText = styled(CardText)`
  max-width: 70%;
  grid-area: text;
`

const WideNaviCardbutton = styled(Button)`
  grid-area: button;
  max-height: 37px;
`

function WideNaviCard(props: NaviCardProps) {
  const { item } = props

  return (
    <Grid item xs={12}>
      <StyledLink href={item.link} prefetch={false} aria-label={item.linkText}>
        <NaviItemBase>
          {item.img && (
            <BackgroundImage
              src={require(`/public/images/navi/${item.img}`)}
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt=""
              aria-hidden
              {...(item.imgDimensions ?? { fill: true })}
            />
          )}
          <Background>
            {item.titleImg ? (
              <TitleImageContainer>
                <ContainedImage
                  src={require(`/public/images/navi/${item.titleImg}`)}
                  placeholder="blur"
                  alt={item.title ?? ""}
                  {...(item.titleImgDimensions ?? {
                    sizes:
                      "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                    fill: true,
                  })}
                />
              </TitleImageContainer>
            ) : (
              <WideNaviCardTitle component="h2" variant="h3" align="left">
                {item.title}
              </WideNaviCardTitle>
            )}
            <WideNaviCardText paragraph variant="body1" align="left">
              {item.text}
            </WideNaviCardText>
            {item.linkText && (
              <WideNaviCardbutton aria-disabled>
                {item.linkText}
              </WideNaviCardbutton>
            )}
          </Background>
        </NaviItemBase>
      </StyledLink>
    </Grid>
  )
}

export default WideNaviCard
