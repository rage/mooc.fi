import { useMemo } from "react"

import { LinkBoxProps } from "../Common/LinkBox"
import LinkBoxList from "../Common/LinkBoxList"
import PartnerDivider from "/components/PartnerDivider"
import { useTranslator } from "/hooks/useTranslator"
import NaviTranslations from "/translations/navi"

type NaviItem = {
  title: string
  text: string
  linkText: string
  img: string
  link: string
}

type CustomNaviItem = {
  title: string
  text: string
  linkText: string
  img?: string
  imgDimensions?: { width: number; height: number }
  link: string
  titleImg?: string
  titleImgDimensions?: { width: number; height: number }
}

function Hype() {
  const t = useTranslator(NaviTranslations)

  const items = t("naviItems") as readonly NaviItem[]
  const customItems = t("customNaviItems") as readonly CustomNaviItem[]

  const listItems: Array<LinkBoxProps> = useMemo(
    () =>
      items.map(({ title, text, link, linkText }) => ({
        title,
        description: text,
        /*imageProps: {
        src: '/images/navi/' + item.img,
        alt: item.title,
        fill: true
      },*/
        linkProps: {
          href: link,
          children: linkText,
        },
      })),
    [items],
  )

  const customListItems: Array<LinkBoxProps> = useMemo(
    () =>
      customItems.map(
        ({ title, text, titleImg, titleImgDimensions, link, linkText }) => ({
          title,
          titleImage: titleImg,
          description: text,
          ...(titleImg
            ? {
                titleImageProps: {
                  src: "/images/navi/" + titleImg,
                  alt: title,
                  ...(titleImgDimensions ?? { fill: true }),
                },
              }
            : {}),
          linkProps: {
            href: link,
            children: linkText,
          },
        }),
      ),
    [customItems],
  )

  return (
    <>
      <LinkBoxList items={listItems} />
      {customListItems.length > 0 && (
        <>
          <PartnerDivider
            sx={{
              h4: {
                fontSize: "0.875rem",
                color: "#888",
              },
              marginBottom: "0.5rem",
              paddingLeft: "0",
            }}
          />
          <LinkBoxList
            items={customListItems}
            variant="wide"
            LinkBoxProps={{
              sx: {
                backgroundColor: "#ccc",
              },
            }}
          />
        </>
      )}
    </>
  )
}

export default Hype
