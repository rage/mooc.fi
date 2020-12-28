import { Grid } from "@material-ui/core"
import NaviCard from "./NaviCard"

import Container from "/components/Container"
import NaviTranslations from "/translations/navi"
import { useTranslator } from "/util/useTranslator"

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
      </Grid>
    </Container>
  )
}

export default NaviCardList
