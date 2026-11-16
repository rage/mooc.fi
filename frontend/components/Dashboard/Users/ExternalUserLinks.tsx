import { Button } from "@mui/material"

import { useTranslator } from "/hooks/useTranslator"
import { coursesUserSearchUrl, tmcParticipantUrl } from "/lib/externalUserLinks"
import UsersTranslations from "/translations/users"

interface ExternalUserLinksProps {
  upstreamId: number
}

/** Opens the same user in the tmc.mooc.fi and courses.mooc.fi admin tools. */
const ExternalUserLinks = ({ upstreamId }: ExternalUserLinksProps) => {
  const t = useTranslator(UsersTranslations)

  return (
    <>
      <Button
        href={tmcParticipantUrl(upstreamId)}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
      >
        {t("openOnTmc")}
      </Button>
      <Button
        href={coursesUserSearchUrl(upstreamId)}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
      >
        {t("findOnCoursesMoocFi")}
      </Button>
    </>
  )
}

export default ExternalUserLinks
