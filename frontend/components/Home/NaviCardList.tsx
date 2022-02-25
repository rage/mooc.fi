import Container from "/components/Container"
import WideNaviCard from "/components/Home/WideNaviCard"
import NaviTranslations from "/translations/navi"
import { useTranslator } from "/util/useTranslator"

import styled from "@emotion/styled"
import { Grid, Typography } from "@mui/material"

import NaviCard from "./NaviCard"

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

const PartnerDivider = styled((props: any) => (
  <Typography variant="h4" {...props} />
))`
  display: block;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  line-height: 0.1em;
  margin: 2rem 0 0 2rem;

  span {
    background-color: #fff;
    padding: 0.5rem;
  }
`
function NaviCardList() {
  const t = useTranslator(NaviTranslations)

  const items = t("naviItems") as NaviItem[]
  const customItems = t("customNaviItems") as NaviItem[]

  return (
    <Container>
      <Grid container spacing={3} style={{ marginBottom: "3em" }}>
        {items.map((item) => (
          <NaviCard
            key={`navi-${item.title}`}
            item={item}
            count={items.length}
          />
        ))}
        {customItems.length ? (
          <PartnerDivider>
            <span>{t("partners")}</span>
          </PartnerDivider>
        ) : null}
        {customItems.map((item) => (
          <WideNaviCard key={`navi-${item.title}`} item={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default NaviCardList
