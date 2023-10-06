import Hero from "../Common/Hero"
import { useTranslator } from "/hooks/useTranslator"
import HomeTranslations from "/translations/home"

function FrontpageHero() {
  const t = useTranslator(HomeTranslations)
  return (
    <Hero
      title={t("tagLine")}
      description={t("intro")}
      type="front_page"
      color="white"
      size="large"
      imageProps={{
        src: "/images/new/frontpage_hero_image_cropped.png",
        width: 620,
        height: 465,
        priority: true,
        alt: "hero image of a woman enjoying programming",
      }}
      linkProps={{
        href: "#courses",
        variant: "hero-white",
        children: t("courseButton"),
      }}
    />
  )
}

export default FrontpageHero
