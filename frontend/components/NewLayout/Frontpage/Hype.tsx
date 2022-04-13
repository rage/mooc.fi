import { SectionContainer } from "/components/NewLayout/Common"
import {
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  CardWrapper,
} from "/components/NewLayout/Common/Card"
import NaviTranslations from "/translations/navi"
import { useTranslator } from "/util/useTranslator"

import styled from "@emotion/styled"

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

// either 4, 2 or 1 columns, depending on the number of items
const HypeGrid = styled.div<{ count?: number }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${({ count = 4 }) =>
    count % 2 === 0
      ? "repeat(auto-fit, minmax(200px, 1fr))"
      : `repeat(auto-fit, minmax(166px, 1fr))`};
  padding: 2rem;
  justify-content: center;
  width: 80%;

  @media (max-width: 1200px) {
    grid-template-columns: ${({ count = 4 }) =>
      count % 2 === 0
        ? "repeat(auto-fit, minmax(300px, 1fr))"
        : `repeat(auto-fit, minmax(450px, 1fr))`};
  }

  @media (max-width: 400px) {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`

interface HypeCardProps {
  item: NaviItem
}

const HypeCard = ({ item: { title, text } }: HypeCardProps) => {
  return (
    <CardWrapper>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <CardDescription>{text}</CardDescription>
      </CardBody>
    </CardWrapper>
  )
}
function Hype() {
  const t = useTranslator(NaviTranslations)

  const items = t("naviItems") as Array<NaviItem>

  // remember to test with divisible by 2 and 3
  return (
    <SectionContainer>
      <HypeGrid count={items.length}>
        {items.map((item) => (
          <HypeCard key={`hype-${item.title}`} item={item} />
        ))}
      </HypeGrid>
    </SectionContainer>
  )
}

export default Hype
