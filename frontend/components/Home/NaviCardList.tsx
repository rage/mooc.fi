import Container from "/components/Container"
import UkraineInfo from "/components/Home/UkraineInfo"
import WideNaviCard from "/components/Home/WideNaviCard"
import PartnerDivider from "/components/PartnerDivider"
import NaviTranslations from "/translations/navi"
import { useTranslator } from "/util/useTranslator"

import { Grid } from "@mui/material"

import NaviCard from "./NaviCard"

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

function NaviCardList() {
  const t = useTranslator(NaviTranslations)

  const items = t("naviItems") as NaviItem[]
  const customItems = t("customNaviItems") as NaviItem[]

  return (
    <Container>
      <Grid container spacing={3} style={{ marginBottom: "3em" }}>
        <UkraineInfo />
        {items.map((item) => (
          <NaviCard
            key={`navi-${item.title}`}
            item={item}
            count={items.length}
          />
        ))}
        {customItems.length ? <PartnerDivider /> : null}
        {customItems.map((item) => (
          <WideNaviCard key={`navi-${item.title}`} item={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default NaviCardList
