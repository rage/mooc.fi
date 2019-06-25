import React from "react"
import { Grid } from "@material-ui/core"
import NaviCard from "./NaviCard"
import NextI18Next from "../../i18n"
import styled from "styled-components"

const GridContainer = styled.section`
  margin-bottom: 2em;
  margin-left: 1em;
  margin-right: 1em;
  @media (min-width: 420px) {
    margin-left: 1.5em;
    margin-right: 1.5em;
  }
  @media (min-width: 700px) {
    margin-left: 2.5em;
    margin-right: 2.5em;
  }
  @media (min-width: 1000px) {
    margin-left: 3.5em;
    margin-right: 3.5em;
  }
`

function NaviCardList() {
  const { t, i18n } = NextI18Next.useTranslation("navi")
  const items = t("naviItems")
  console.log(items)
  return (
    <GridContainer>
      <Grid container spacing={3}>
        {items.map(item => (
          <NaviCard key={item.title} item={item} />
        ))}
      </Grid>
    </GridContainer>
  )
}

export default NaviCardList
