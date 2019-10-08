import React from "react"
import LangLink from "/components/LangLink"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { mime } from "/util/imageUtils"
import Button from "@material-ui/core/Button"

const NaviItemBase = styled(ButtonBase)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  align-items: flex-start;
`
const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
`

const StyledLink = styled.a`
  color: black;
  text-decoration: none;
`
const TextBackground = styled.span`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  display: flex;
  flex-direction: column;
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
  // const image = require(`../../static/images/${item.img}`)
  return (
    <Grid item {...gridLayout(count)}>
      <LangLink href={item.link} prefetch={false}>
        <StyledLink aria-label={item.linkText}>
          <NaviItemBase focusRipple>
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
            <TextBackground style={{ width: "100%" }}>
              <Typography
                component="h3"
                variant="h3"
                gutterBottom={true}
                align="left"
                style={{ maxWidth: "70%" }}
              >
                {item.title}
              </Typography>
              <Typography
                component="p"
                variant="body1"
                align="left"
                paragraph
                style={{ minWidth: "70%", flex: 1 }}
              >
                {item.text}
              </Typography>
              <Button fullWidth aria-disabled="true">
                {item.linkText}
              </Button>
            </TextBackground>
          </NaviItemBase>
        </StyledLink>
      </LangLink>
    </Grid>
  )
}

export default NaviCard
