import { useMemo } from "react"

import ContentWrapper from "../Common/ContentWrapper"
//import GeneralList from "../Common/GeneralList"
// import { GeneralListItemProps } from "../Common/GeneralListItem"
import { LinkBoxProps } from "../Common/LinkBox"
import LinkBoxList from "../Common/LinkBoxList"
// import PartnerDivider from "/components/NewLayout/Common/PartnerDivider"
import { useTranslator } from "/hooks/useTranslator"
import NaviTranslations from "/translations/navi"

type NaviItem = {
  title: string
  text: string
  linkText?: string
  img?: string
  link?: string
}

/*type CustomNaviItem = {
  title: string
  text: string
  linkText: string
  img?: string
  imgDimensions?: { width: number; height: number }
  link: string
  titleImg?: string
  titleImgDimensions?: { width: number; height: number }
}*/

function Hype() {
  const t = useTranslator(NaviTranslations)

  const items = t("naviItems") as readonly NaviItem[]
  //const customItems = t("customNaviItems") as readonly CustomNaviItem[]

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
        linkProps:
          link && linkText
            ? {
                href: link,
                children: linkText,
              }
            : undefined,
      })),
    [items],
  )

  /*const listItems: Array<GeneralListItemProps> = useMemo(
    () =>
      items.map(({ title, text, link, linkText, img }) => ({
        title,
        description: text,
        linkProps: {
          href: link,
          children: linkText,
        },
        imageProps: {
          src: "/images/navi/" + img,
          alt: title,
          fill: true,
        },
      })),
    [items],
  )*/
  /*const customListItems: Array<LinkBoxProps> = useMemo(
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
  )*/

  return (
    <ContentWrapper>
      <LinkBoxList items={listItems} />
      {/*<GeneralList type="grid" items={listItems} />*/}
      {/*customListItems.length > 0 && (
        <>
          <PartnerDivider />
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
          )*/}
    </ContentWrapper>
  )
}

export default Hype
