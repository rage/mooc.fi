import Image from "next/image"

import styled from "@emotion/styled"

import CoursesTranslations from "/translations/_new/courses"
import { useTranslator } from "/util/useTranslator"

const Container = styled.div`
  display: grid;
  justify-items: center;
`

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
`

const Item = styled.div`
  margin: 2rem;
  display: grid;
  grid-gap: 2rem;
  justify-items: center;
`

function HeroSection() {
  const t = useTranslator(CoursesTranslations)

  return (
    <Container>
      <h1>{t("heroSectionHeader")}</h1>
      <ItemContainer>
        <Item>
          <Image
            src="/static/images/new/components/courses/herosection_icon1.png"
            alt="Not Found"
            className="group-3487"
            width="150"
            height="150"
          />
          {t("heroSectionDescription1")}
        </Item>
        <Item>
          <Image
            src="/static/images/new/components/courses/herosection_transition_icon.png"
            alt="Not Found"
            className="group-3487"
            width="25"
            height="50"
          />
        </Item>
        <Item>
          <Image
            src="/static/images/new/components/courses/herosection_icon2.png"
            alt="Not Found"
            className="group-3487"
            width="150"
            height="150"
          />
          {t("heroSectionDescription2")}
        </Item>
        <Item>
          <Image
            src="/static/images/new/components/courses/herosection_transition_icon.png"
            alt="Not Found"
            className="group-3487"
            width="25"
            height="50"
          />
        </Item>
        <Item>
          <Image
            src="/static/images/new/components/courses/herosection_icon3.png"
            alt="Not Found"
            className="group-3487"
            width="150"
            height="150"
          />
          {t("heroSectionDescription3")}
        </Item>
      </ItemContainer>
    </Container>
  )
}

export default HeroSection
