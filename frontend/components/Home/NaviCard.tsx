import React from "react"
import LangLink from "/components/LangLink"
import Grid from "@material-ui/core/Grid"
import styled from "styled-components"
import { mime } from "/util/imageUtils"
import Button from "@material-ui/core/Button"
import { CardTitle } from "components/Text/headers"
import { CardText } from "/components/Text/paragraphs"
import {
  BackgroundImage,
  FullCoverTextBackground,
} from "/components/Images/CardBackgroundFullCover"

const NaviItemBase = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  align-items: flex-start;
  &:hover {
    box-shadow: 32px 27px 72px -52px rgba(0, 0, 0, 1);
    cursor: pointer;
  }
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
}

interface NaviCardProps {
  item: NaviItem
  count: number
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
  return (
    <Grid item {...gridLayout(count)}>
      <LangLink href={item.link} prefetch={false}>
        <StyledLink aria-label={item.linkText}>
          <NaviItemBase>
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
            <FullCoverTextBackground style={{ width: "100%" }}>
              <CardTitle
                component="h3"
                variant="h3"
                align="left"
                style={{ maxWidth: "70%" }}
              >
                {item.title}
              </CardTitle>
              <CardText
                component="p"
                variant="body1"
                align="left"
                style={{ minWidth: "70%", flex: 1 }}
              >
                {item.text}
              </CardText>
              <Button fullWidth aria-disabled="true">
                {item.linkText}
              </Button>
            </FullCoverTextBackground>
          </NaviItemBase>
        </StyledLink>
      </LangLink>
    </Grid>
  )
}

export default NaviCard
