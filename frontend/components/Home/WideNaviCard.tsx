import {
  BackgroundImage,
  FullCoverTextBackground,
} from "/components/Images/CardBackgroundFullCover"
import { CardText } from "/components/Text/paragraphs"
import { mime } from "/util/imageUtils"
import styled from "@emotion/styled"
import { Button } from "@mui/material"
import Grid from "@mui/material/Grid"
import { ClickableDiv } from "components/Surfaces/ClickableCard"
import { CardTitle } from "components/Text/headers"
import Link from "next/link"

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

const TitleImage = styled.img`
  width: 70%;
  max-width: 20vh;
`

function WideNaviCard(props: NaviCardProps) {
  const { item } = props

  return (
    <Grid item xs={12}>
      <Link href={item.link} passHref prefetch={false}>
        <StyledLink aria-label={item.linkText}>
          <NaviItemBase>
            {item.img && (
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
                  loading="lazy"
                  alt=""
                />
              </picture>
            )}
            <Background>
              <CardTitle
                component="h2"
                variant="h3"
                align="left"
                style={{ maxWidth: "70%" }}
              >
                {item.titleImg ? (
                  <picture>
                    <source
                      srcSet={require(`../../static/images/${item.titleImg}?webp`)}
                      type="image/webp"
                    />
                    <source
                      srcSet={require(`../../static/images/${item.titleImg}`)}
                      type={mime(item.titleImg)}
                    />
                    <TitleImage
                      src={require(`../../static/images/${item.titleImg}`)}
                      alt={item.title}
                    />
                  </picture>
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
              {item.linkText && (
                <Button
                  aria-disabled="true"
                  style={{ width: "20%", maxHeight: "37px" }}
                >
                  {item.linkText}
                </Button>
              )}
            </Background>
          </NaviItemBase>
        </StyledLink>
      </Link>
    </Grid>
  )
}

export default WideNaviCard
