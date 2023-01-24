import { styled } from "@mui/material/styles"

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

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

// either 4, 2 or 1 columns, depending on the number of items
const HypeGrid = styled("div", {
  shouldForwardProp: (prop) => prop !== "count",
})<{ count?: number }>(
  ({ theme, count = 4 }) => `
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${
    count % 2 === 0
      ? "repeat(auto-fit, minmax(200px, 1fr))"
      : `repeat(auto-fit, minmax(166px, 1fr))`
  };
  padding: 2rem;
  justify-content: center;
  width: 80%;

  ${theme.breakpoints.down("lg")} {
    grid-template-columns: ${
      count % 2 === 0
        ? "repeat(auto-fit, minmax(300px, 1fr))"
        : `repeat(auto-fit, minmax(450px, 1fr))`
    };
  }

  ${theme.breakpoints.down("xs")} {
    padding: 0;
    width: 100%;
    grid-template-columns: 1fr;
  }
`,
)

const HypeCardHeader = styled(CardHeader)`
  background-color: #f5f5f5;
`
interface HypeCardProps {
  item: NaviItem
}

const HypeCard = ({ item: { title, text } }: HypeCardProps) => {
  return (
    <CardWrapper>
      <HypeCardHeader>
        <CardTitle variant="h3">{title}</CardTitle>
      </HypeCardHeader>
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
