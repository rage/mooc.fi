import { useRouter } from "next/router"

import { Typography } from "@mui/material"

import OutboundLink from "/components/OutboundLink"
import { useTranslator } from "/hooks/useTranslator"
import { coursesPageUrl } from "/lib/coursesBaseUrl"
import ProfileTranslations from "/translations/profile"

/** Points students who also study on courses.mooc.fi to their courses there. */
const MyStudiesNote = () => {
  const t = useTranslator(ProfileTranslations)
  const { locale } = useRouter()

  return (
    <Typography variant="body2" sx={{ margin: "1rem 0" }}>
      {t("myStudiesNote")}{" "}
      <OutboundLink
        href={coursesPageUrl("/profile/studies", locale)}
        rel="noopener noreferrer"
      >
        {t("myStudiesLink")}
      </OutboundLink>
    </Typography>
  )
}

export default MyStudiesNote
