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
import Button from "@mui/material/Button"
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
  title: string
  text: string
  linkText: string
  img: string
  link: string
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
            <FullCoverTextBackground style={{ width: "100%" }}>
              <CardTitle
                component="h2"
                variant="h3"
                align="left"
                style={{ maxWidth: "70%" }}
              >
                {item.titleImg ? (
                  <img src={item.titleImg} alt="" style={{ width: "70%" }} />
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
                <Button fullWidth aria-disabled="true">
                  {item.linkText}
                </Button>
              ) : undefined}
            </FullCoverTextBackground>
          </NaviItemBase>
        </StyledLink>
      </LangLink>
    </Grid>
  )
}

export default NaviCard
