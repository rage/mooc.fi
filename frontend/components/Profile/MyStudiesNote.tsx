import { useRouter } from "next/router"

import { Link, Typography } from "@mui/material"

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
      <Link
        href={coursesPageUrl("/profile/studies", locale)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("myStudiesLink")}
      </Link>
    </Typography>
  )
}

export default MyStudiesNote
