import {
  BackgroundImage,
  FullCoverTextBackground,
} from "/components/Images/CardBackgroundFullCover"
import LangLink from "/components/LangLink"
import { CardText } from "/components/Text/paragraphs"
import { mime } from "/util/imageUtils"
import { ClickableDiv } from "components/Surfaces/ClickableCard"
import { CardTitle } from "components/Text/headers"

import styled from "@emotion/styled"
import { Button } from "@mui/material"
import Grid from "@mui/material/Grid"

const NaviItemBase = styled(ClickableDiv)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: flex-start;
`

const StyledLink = styled.a`
  color: black;
  text-decoration: none;
`

type NaviItem = {
  title?: string
  text: string
  linkText: string
  img?: string
  link: string
  titleImg?: string
}

interface NaviCardProps {
  item: NaviItem
}

const Background = styled(FullCoverTextBackground)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`

function WideNaviCard(props: NaviCardProps) {
  const { item } = props

  return (
    <Grid item xs={12}>
      <LangLink href={item.link} passHref prefetch={false}>
        <StyledLink aria-label={item.linkText}>
          <NaviItemBase>
            {item.img ? (
              <picture>
                <source
                  srcSet={require(`../../static/images/${item.img}?webp`)}
                  type="image/webp"
                />
                <source
                  srcSet={require(`../../static/images/${item.img}`)}
                  type={mime(item.img)}
                />
                <BackgroundImage
                  src={require(`../../static/images/${item.img}`)}
                  alt=""
                />
              </picture>
            ) : null}
            <Background>
              <CardTitle
                component="h2"
                variant="h3"
                align="left"
                style={{ maxWidth: "70%" }}
              >
                {item.titleImg ? (
                  <img
                    src={item.titleImg}
                    alt={item.title}
                    style={{ width: "70%", maxWidth: "20vh" }}
                  />
                ) : (
                  item.title
                )}
              </CardTitle>
              <CardText
                component="p"
                variant="body1"
                align="left"
                style={{ minWidth: "70%", flex: 1 }}
              >
                {item.text}
              </CardText>
              {item.linkText ? (
                <Button
                  aria-disabled="true"
                  style={{ width: "20%", maxHeight: "37px" }}
                >
                  {item.linkText}
                </Button>
              ) : undefined}
            </Background>
          </NaviItemBase>
        </StyledLink>
      </LangLink>
    </Grid>
  )
}

export default WideNaviCard
