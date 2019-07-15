import React from "react"
import { Grid } from "@material-ui/core"
import NaviCard from "./NaviCard"
import NextI18Next from "../../i18n"
import Container from "../Container"

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

function NaviCardList() {
  const { t, ready } = NextI18Next.useTranslation("navi")

  if (ready) {
    const items: NaviItem[] = t("naviItems")

    return (
      <Container>
        <Grid container spacing={3}>
          {items.map(item => (
            <NaviCard key={item.title} item={item} />
          ))}
        </Grid>
      </Container>
    )
  }
  return <p>Loading</p>
}

export default NaviCardList
