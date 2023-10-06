import React from "react"

import { range } from "remeda"

import { PropsOf } from "@emotion/react"
import { styled } from "@mui/material/styles"

import LinkBox, { LinkBoxProps, LinkBoxSkeleton } from "./LinkBox"

const linkBoxListVariants = ["default", "wide-box"] as const

export type LinkBoxListVariant = (typeof linkBoxListVariants)[number]

const LinkBoxListComponent = styled("ul")(
  ({ theme }) => `
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  gap: 32px 0;

  :not(.wide-card) {
    ${theme.breakpoints.up(768)} {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px 24px;
    }

    ${theme.breakpoints.up(1920)} {
      gap: 32px;
    }
  }

  .wide-box {
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

type LinkBoxListBaseProps = {
  items: Array<LinkBoxProps>
  variant?: LinkBoxListVariant
  loading?: false
} & Omit<PropsOf<typeof LinkBox>, keyof LinkBoxProps>
type LinkBoxListLoadingProps = {
  items?: Array<LinkBoxProps>
  loading: true
  variant?: LinkBoxListVariant
} & PropsOf<typeof LinkBoxSkeleton>
type LinkBoxListProps = LinkBoxListBaseProps | LinkBoxListLoadingProps

const isLoading = (props: LinkBoxListProps): props is LinkBoxListLoadingProps =>
  props?.loading ?? false

const LinkBoxList = (props: LinkBoxListProps) => {
  const { items, loading, variant, ...rest } = props
  return (
    <>
      <LinkBoxListComponent
        className={variant === "wide-box" ? "wide-box" : undefined}
      >
        {isLoading(props)
          ? range(0, 3).map((index) => (
              <li key={`skeleton-${index}`}>
                <LinkBoxSkeleton {...rest} />
              </li>
            ))
          : items?.map((item) => (
              <li
                key={
                  item.linkProps
                    ? (item.linkProps.href as string)
                    : item.title.toLowerCase().replace(/\s/g, "")
                }
              >
                <LinkBox {...item} {...rest} />
              </li>
            ))}
      </LinkBoxListComponent>
      <Spacer />
    </>
  )
}

export default LinkBoxList
