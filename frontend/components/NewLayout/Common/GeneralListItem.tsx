import Image, { ImageProps } from "next/image"

import { EnhancedLink, EnhancedLinkProps, Link } from "@mui/material"
import { styled } from "@mui/material/styles"

import { ListStyle } from "./GeneralList"
import { fontSize } from "/src/theme/util"

const ListItemRoot = styled("li")`
  display: block;
  height: 100%;
`

const ListItemContainer = styled("article")`
  margin-bottom: 1rem;
  height: 100%;
`

const ListItemMeta = styled("span")(
  ({ theme }) => `
  ${fontSize(12, 14)}
  color: ${theme.palette.common.grayscale.dark};
  letter-spacing: -0.1px;
  text-transform: uppercase;
  margin: 9px 0;
`,
)

const ListItemMetaDate = styled("span")`
  font-weight: 200;
  margin-left: 4px;
`

const ListItemLink = styled(Link)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  position: relative;
  text-decoration: none;

  ${theme.breakpoints.up("sm")} {
    flex-direction: row;
  }

  &:hover {
    cursor: pointer;
  }

  &:hover,
  &:focus {
    ${ListItemType} span {
      background-color: ${theme.palette.common.brand.main};
    }

    ${ListItemTitle} {
      color: ${theme.palette.common.brand.main};
      text-decoration: underline;
    }
  }

  .list-item__style-grid & {
    height: 100%;

    ${theme.breakpoints.up("sm")} {
      flex-direction: column;
    }

  }
`,
) as EnhancedLink

const ListItemImageContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  justify-content: stretch;
  margin: 0;
  position: relative;
  width: 100%;

  ${theme.breakpoints.down("sm")} {
    display: none;
  }

  ${theme.breakpoints.up("sm")} {
    max-width: 35.7%;
  }

  ${theme.breakpoints.up("md")} {
    max-width: 23.13%;
  }

  ${theme.breakpoints.up("lg")} {
    max-width: 23.03%;
  }

  &:before {
    content: "";
    display: block;
    padding-top: 62.5%;
  }

  .list-item__style-grid & {
    border: 1px solid ${theme.palette.common.grayscale.light};
    max-width: 100%;

    ${theme.breakpoints.down("sm")} {
      display: flex;
    }
  
  }

`,
)

const ListItemImage = styled(Image)`
  bottom: 0;
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;

  background-color: #ececec;
`

const ListItemType = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.backgroundBox};
  padding-top: 16px;
  z-index: 10;

  ${theme.breakpoints.up("sm")} {
    background-color: transparent;
    left: -8px;
    padding-top: 0;
    position: absolute;
    top: 16px;
  }

  .list-item__type__major {
    ${fontSize(12, 14)}
    font-weight: 700;
    background-color: ${theme.palette.common.grayscale.black};
    color: ${theme.palette.common.grayscale.white};
    letter-spacing: -0.1px;
    padding: 5px 8px;
    text-transform: uppercase;
    align-self: baseline;
    margin-left: -8px;

    ${theme.breakpoints.up("sm")} {
      margin-left: 0;
    }
  }

  .list-item__type__sub {
    ${fontSize(12, 14)}
    background-color: ${theme.palette.common.grayscale.black};
    color: ${theme.palette.common.grayscale.white};
    letter-spacing: -0.1px;
    padding: 5px 8px;
    margin-left: -8px;
  }
`,
)

const ListItemTextContainer = styled("div")(
  ({ theme }) => `
  background-color: ${theme.palette.common.grayscale.backgroundBox};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 16px 12px;

  ${theme.breakpoints.up("md")} {
    padding: 14px 32px 24px 24px;
  }

  ${theme.breakpoints.up("lg")} {
    padding: 20px 104px 32px 32px;
  }

  .list-item__style-grid & {
    ${theme.breakpoints.up("md")} {
      padding: 12px 12px 32px 12px;
    }
    ${theme.breakpoints.up("lg")} {
      padding: 12px 12px 32px 12px;
    }    
  }

`,
)

const ListItemTitle = styled("h3")(
  ({ theme }) => `
  ${fontSize(18, 22)}
  font-weight: 700;
  color: ${theme.palette.common.brand.nearlyBlack};
  letter-spacing: -0.45px;
  margin-bottom: 8px;
  margin-top: 0;

  ${theme.breakpoints.up("xl")} {
    ${fontSize(20, 24)}
    letter-spacing: -0.5px;
  }

  .list-item__title__large {
    ${theme.breakpoints.up("lg")} {
      ${fontSize(20, 24)}
      letter-spacing: -0.5px;
    }
  }
`,
)

const ListItemDescription = styled("p")(
  ({ theme }) => `
  ${fontSize(15, 20)}
  color: ${theme.palette.common.grayscale.dark};
  display: none;
  letter-spacing: -0.09px;
  margin: 0;

  ${theme.breakpoints.up("sm")} {
    ${fontSize(14, 18)}
    display: block;
    letter-spacing: -0.08px;
  }

  ${theme.breakpoints.up("xl")} {
    ${fontSize(14, 20)}
  }

  .list-item__description__large {
    ${theme.breakpoints.up("lg")} {
      ${fontSize(14, 20)}
    }
  }
`,
)

const listItemSizes = ["common", "large"] as const

type ListItemSize = (typeof listItemSizes)[number]

export interface GeneralListItemProps {
  listStyle?: ListStyle
  type?: string
  size?: ListItemSize
  imageProps?: ImageProps
  tag?: string
  date?: string
  title: string
  description: string
  linkProps: EnhancedLinkProps
  label?: string
  subLabel?: string
}

const GeneralListItem = ({
  listStyle,
  type,
  size = "large",
  imageProps,
  tag,
  date,
  label,
  subLabel,
  title,
  description,
  linkProps,
}: GeneralListItemProps) => {
  return (
    <ListItemRoot>
      <ListItemContainer className={`list-item__style-${listStyle}`}>
        <ListItemLink {...linkProps}>
          {type && (
            <ListItemType>
              <span className="list-item__type__major">{label}</span>
              <span className="list-item__type__sub">{subLabel}</span>
            </ListItemType>
          )}
          {imageProps?.src && (
            <ListItemImageContainer>
              <ListItemImage {...imageProps} />
            </ListItemImageContainer>
          )}
          <ListItemTextContainer>
            {(tag || date) && (
              <ListItemMeta>
                {tag}
                <ListItemMetaDate>
                  {tag && "|"} {date}
                </ListItemMetaDate>
              </ListItemMeta>
            )}
            <ListItemTitle className={`list-item__title__${size}`}>
              {title}
            </ListItemTitle>
            <ListItemDescription className={`list-item__description__${size}`}>
              {description}
            </ListItemDescription>
          </ListItemTextContainer>
        </ListItemLink>
      </ListItemContainer>
    </ListItemRoot>
  )
}

export default GeneralListItem
