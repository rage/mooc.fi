import React from "react"
import NextI18Next from "../../i18n"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const NaviItemBase = styled(ButtonBase)`
  position: relative;
  height: 360px;
  @media (min-width: 425px) {
    height: 295px;
  }
  @media (min-width: 600px) {
    height: 380px;
  }
  @media (min-width: 750px) {
    height: 360px;
  }
  @media (min-width: 960px) {
    height: 380px;
  }
  @media (min-width: 1280px) {
    height: 310px;
  }
  @media (min-width: 1440px) {
    height: 310px;
  }
  width: 100%;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
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
const NaviTextContainer = styled.span`
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

const Title = styled(Typography)`
  font-size: 22px;
  margin-bottom: 1rem;
  margin-left: 1rem;
  max-width: 60%;
`
const Text = styled(Typography)`
  font-size: 16px;
  max-width: 60%;
  text-align: left;
  margin: 0;
  margin-left: 1rem;
  @media (min-width: 1280px) {
    max-width: 55%;
  }
  flex: 1;
  margin-bottom: 1rem;
`

const Link = styled.a`
  color: #00a68d;
  font-size: 18px;
  max-width: 60%;
  text-align: left;
  margin-left: 1rem;
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
}

function NaviCard(props: NaviCardProps) {
  const { item } = props
  const image = require(`../../static/images/${item.img}`)

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <NaviItemBase focusRipple>
        <BackgroundImage src={image} alt="" />

        <NaviTextContainer>
          <Title align="left">{item.title}</Title>
          <Text>{item.text}</Text>
          <Typography align="left">
            <NextI18Next.Link href={item.link}>
              <Link href={item.link} aria-label={item.linkText}>
                {item.linkText}
              </Link>
            </NextI18Next.Link>
          </Typography>
        </NaviTextContainer>
      </NaviItemBase>
    </Grid>
  )
}

export default NaviCard
