import React, { PropsWithChildren } from "react"

import { PropsOf } from "@emotion/react"
import { styled } from "@mui/material/styles"

const BorderedSectionBase = styled("div")`
  --border-color: #b2b2b2;

  display: flex;
  flex-direction: column;
  max-width: 100%;

  border-left: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-radius: 5px;
  margin: 1em;

  .childrenContainer {
    padding: 1em;
  }

  .header {
    display: flex;
    flex-direction: row;
    width: 100% !important;

    .headerBorderBefore {
      border-top: 1px solid var(--border-color);
      width: 1em;
      border-top-left-radius: 5px;
    }

    .headerTitle {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      gap: 0.25em;
      width: fit-content;
      height: 2em;
      margin: -1em 0.5em 0em 0.5em;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .headerBorderAfter {
      border-top: 1px solid var(--border-color);
      width: 1em;
      flex-grow: 2;
      border-top-right-radius: 5px;
    }
  }
`

function BorderedSection({
  title,
  children,
  ...props
}: PropsWithChildren<
  Omit<PropsOf<typeof BorderedSectionBase>, "title"> & {
    title?: string | React.ReactNode
  }
>) {
  return (
    <BorderedSectionBase {...props}>
      <div className="header">
        <div className="headerBorderBefore"></div>
        {title && <div className="headerTitle">{title}</div>}
        <div className="headerBorderAfter"></div>
      </div>
      <div className="childrenContainer">{children}</div>
    </BorderedSectionBase>
  )
}

export default BorderedSection
