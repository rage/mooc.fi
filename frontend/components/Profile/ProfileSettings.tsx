import { useRouter } from "next/router"

import CTALink from "../NewLayout/Common/CTALink"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import { coursesPageUrl } from "/lib/coursesBaseUrl"
import ProfileTranslations from "/translations/profile"

const ProfileSettings = () => {
  const t = useTranslator(ProfileTranslations)
  const isOld = useIsOld()
  const { locale } = useRouter()
  const accountSettingsUrl = coursesPageUrl("/user-settings", locale)

  return (
    <>
      <p>{t("accountSettingsInfo")}</p>
      {isOld ? (
        <a href={accountSettingsUrl} target="_blank" rel="noopener noreferrer">
          {t("accountSettingsLink")}
        </a>
      ) : (
        <CTALink
          href={accountSettingsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("accountSettingsLink")}
        </CTALink>
      )}
    </>
  )
}

export default ProfileSettings
