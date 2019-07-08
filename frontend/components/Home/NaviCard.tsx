import React from "react"
import NextI18Next from "../../i18n"
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"

const NaviItemBase = styled(ButtonBase)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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

const Link = styled.a`
  color: #00a68d;
  font-size: 18px;
`
const TextBackground = styled.span`
  width: 75%;
  height: 100%;
  margin-right: 25%;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem;
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
    <Grid item xs={12} sm={6} md={6} lg={4}>
      <NaviItemBase focusRipple>
        <BackgroundImage src={image} alt="" />
        <TextBackground>
          <Typography
            component="h3"
            variant="h5"
            gutterBottom={true}
            align="left"
          >
            {item.title}
          </Typography>
          <Typography component="p" align="left" paragraph>
            {item.text}
          </Typography>
          <Typography align="left">
            <NextI18Next.Link href={item.link}>
              <Link href={item.link} aria-label={item.linkText}>
                {item.linkText}
              </Link>
            </NextI18Next.Link>
          </Typography>
        </TextBackground>
      </NaviItemBase>
    </Grid>
  )
}

export default NaviCard
