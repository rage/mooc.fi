export default {
  naviItems: [
    {
      title: "Avoimia kursseja, kaikille",
      text: "Kurssimme ovat avoinna kaikille ilman osallistumismaksuja. Voit selata materiaaleja myös ilman tunnuksia.",
      linkText: "Kurssit",
      img: "AllCourses.webp",
      link: "#courses",
    },
    {
      title: "Yliopisto-opetusta, kotonasi",
      text: "Opiskele yliopistokursseja missä vain. Suorituksen rekisteröimällä saat opinnoistasi myös opintopisteitä.",
    },
    {
      title: "Kokonaisuuksia tai yksittäisiä kursseja",
      text: "Voit suorittaa joko laajemman kokoelman kursseja, tai poimia valikoimastamme vain sinua kiinnostavat kurssit.",
      linkText: "Opintokokonaisuudet",
      img: "taydennysKoulutus.webp",
      link: "#modules",
    },
    {
      title: "Käytä kurssejamme opetuksessasi",
      text: "Haluatko kurssimme luokkaasi omilla pistelistoillasi? Katso lisää Opettajalle-sivulta! ",
      linkText: "Opettajien sivut",
      img: "Opettajien.webp",
      link: "/teachers",
    },
  ],
  customNaviItems: [
    {
      title: "LUT",
      text: "LUT-yliopisto tarjoaa ohjelmistotuotannon opintoja joustavina etäopintoina. Opinnot sopivat sinulle, jos sinulla on hieman ohjelmointitaustaa ja haluat täydentää ohjelmistoihin liittyvää suunnittelun, prosessien tai laadunhallinnan osaamistasi.",
      titleImg: "LUT-LOGO-PNG.webp",
      titleImgDimensions: { width: "128", height: "56" },
      link: "#lut",
      linkText: "LUT",
    },
  ],
} as const
