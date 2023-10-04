import { Grid } from "@mui/material"
import { styled } from "@mui/material/styles"

import NaviCard from "./NaviCard"
import Container from "/components/Container"
import UkraineInfo from "/components/Home/UkraineInfo"
import WideNaviCard from "/components/Home/WideNaviCard"
import PartnerDivider from "/components/PartnerDivider"
import { useTranslator } from "/hooks/useTranslator"
import NaviTranslations from "/translations/navi"

type NaviItem = {
  title: string
  text: string
  linkText?: string
  img?: string
  link?: string
}

const NaviCardGrid = styled(Grid)`
  margin-bottom: 3em;
`

function NaviCardList() {
  const t = useTranslator(NaviTranslations)

  const items = t("naviItems") as readonly NaviItem[]
  const customItems = t("customNaviItems") as readonly NaviItem[]

  return (
    <Container>
      <NaviCardGrid container spacing={3}>
        <UkraineInfo />
        {items.map((item) => (
          <NaviCard
            key={item.title ?? item.text}
            item={item}
            count={items.length}
          />
        ))}
        {customItems.length ? <PartnerDivider /> : null}
        {customItems.map((item) => (
          <WideNaviCard key={item.title ?? item.text} item={item} />
        ))}
      </NaviCardGrid>
    </Container>
  )
}

export default NaviCardList
