import { PropsOf } from "@emotion/react"
import { styled } from "@mui/material/styles"

import LinkBox, { LinkBoxProps } from "./LinkBox"

const linkBoxListVariants = ["default", "wide"] as const

export type LinkBoxListVariant = (typeof linkBoxListVariants)[number]

const LinkBoxListContainer = styled("div")`
  display: block;
`

const LinkBoxListComponent = styled("ul")(
  ({ theme }) => `
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  gap: 32px 0;

  :not(.wide) {
    ${theme.breakpoints.up(768)} {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px 24px;
    }
    ${theme.breakpoints.up("desktop")} {
      grid-template-columns: repeat(3, 1fr);
    }
    ${theme.breakpoints.up(1920)} {
      gap: 32px;
    }
  }

  .wide {
    grid-template-columns: 2fr;
  }
`,
)

const Spacer = styled("div")(
  ({ theme }) => `
  display: flex;
  width: 100%;
  margin-top: 1.75rem;
  ${theme.breakpoints.up("md")} {
    margin-top: 2rem;
  }
  ${theme.breakpoints.up("lg")} {
    margin-top: 2.25rem;
  }
`,
)

interface LinkBoxListProps {
  items: Array<LinkBoxProps>
  variant?: LinkBoxListVariant
  LinkBoxProps?: Omit<PropsOf<typeof LinkBox>, keyof LinkBoxProps>
}

const LinkBoxList = ({
  items,
  variant = "default",
  LinkBoxProps,
}: LinkBoxListProps) => (
  <LinkBoxListContainer>
    <LinkBoxListComponent className={variant === "wide" ? "wide" : undefined}>
      {items.map((item) => (
        <li key={item.linkProps.href as string}>
          <LinkBox {...item} {...LinkBoxProps} />
        </li>
      ))}
    </LinkBoxListComponent>
    <Spacer />
  </LinkBoxListContainer>
)

export default LinkBoxList
