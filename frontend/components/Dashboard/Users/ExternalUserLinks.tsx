import { Button, Stack, SxProps, Theme } from "@mui/material"

import { useTranslator } from "/hooks/useTranslator"
import { TMC_BASE_URL } from "/lib/account"
import { COURSES_BASE_URL } from "/lib/coursesBaseUrl"
import UsersTranslations from "/translations/users"

interface ExternalUserLinksProps {
  /** The TMC user id. */
  upstreamId: number
  sx?: SxProps<Theme>
}

/** Opens the same user in the tmc.mooc.fi and courses.mooc.fi admin tools. */
const ExternalUserLinks = ({ upstreamId, sx }: ExternalUserLinksProps) => {
  const t = useTranslator(UsersTranslations)

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={[{ flexWrap: "wrap" }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <Button
        href={`${TMC_BASE_URL}/participants/${upstreamId}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
      >
        {t("openOnTmc")}
      </Button>
      <Button
        href={`${COURSES_BASE_URL}/manage/search-users?search=${upstreamId}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
      >
        {t("findOnCoursesMoocFi")}
      </Button>
    </Stack>
  )
}

export default ExternalUserLinks
