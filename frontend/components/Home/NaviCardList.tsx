import React, { useContext } from "react"
import { Grid } from "@material-ui/core"
import NaviCard from "./NaviCard"

import Container from "/components/Container"
import LanguageContext from "/contexes/LanguageContext"
import getNaviTranslator from "/translations/navi"

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

function NaviCardList() {
  const lng = useContext(LanguageContext)
  const t = getNaviTranslator(lng.language)

  const items = t("naviItems") as NaviItem[]

  return (
    <Container>
      <Grid container spacing={3}>
        {items.map(item => (
          <NaviCard key={`navi-${item.title}`} item={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default NaviCardList
