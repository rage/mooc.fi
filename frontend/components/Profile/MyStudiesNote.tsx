import { Link, Typography } from "@mui/material"

import { useTranslator } from "/hooks/useTranslator"
import { COURSES_BASE_URL } from "/lib/coursesBaseUrl"
import ProfileTranslations from "/translations/profile"

/** Points students who also study on courses.mooc.fi to their courses there. */
const MyStudiesNote = () => {
  const t = useTranslator(ProfileTranslations)

  return (
    <Typography variant="body2" sx={{ margin: "1rem 0" }}>
      {t("myStudiesNote")}{" "}
      <Link
        href={`${COURSES_BASE_URL}/profile/studies`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("myStudiesLink")}
      </Link>
    </Typography>
  )
}

export default MyStudiesNote
