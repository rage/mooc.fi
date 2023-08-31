import React from "react"

import { styled } from "@mui/material/styles"

import GeneralListItem, { GeneralListItemProps } from "./GeneralListItem"

const GeneralListRoot = styled("ul")(
  ({ theme, children }) => `
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 1.75rem;

  ${theme.breakpoints.up("md")} {
    margin-bottom: 2rem;
  }
  ${theme.breakpoints.up("lg")} {
    margin-bottom: 2.5rem;
  }

  &.list__style-grid {
    display: flex;
    display: grid;
    gap: 32px 0;

    ${theme.breakpoints.up(768)} {
      grid-template-columns: repeat(2, 1fr);
      gap: 32px 24px;
    }

    ${theme.breakpoints.up("desktop")} {
      ${
        // no orphans
        React.Children.count(children) % 3 !== 1
          ? "grid-template-columns: repeat(3, 1fr);"
          : ""
      }
    }

    ${theme.breakpoints.up("xxl")} {
      gap: 32px;
    }

    li {
      background-color: ${theme.palette.common.grayscale.backgroundBox};
      width: 100%;
      height: auto;
    }
  }
`,
)

const listStyles = ["list", "grid"] as const

export type ListStyle = (typeof listStyles)[number]

export interface GeneralListProps {
  type?: ListStyle
  items?: Array<GeneralListItemProps>
}

const GeneralList = ({ type, items }: GeneralListProps) => {
  return (
    <GeneralListRoot className={`list__style-${type}`}>
      {items?.map((item) => (
        <GeneralListItem key={item.title} {...item} listStyle={type} />
      ))}
    </GeneralListRoot>
  )
}

export default GeneralList
