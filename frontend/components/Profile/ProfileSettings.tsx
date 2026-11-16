import CTALink from "../NewLayout/Common/CTALink"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import { COURSES_BASE_URL } from "/lib/coursesBaseUrl"
import ProfileTranslations from "/translations/profile"

const ACCOUNT_SETTINGS_URL = `${COURSES_BASE_URL}/user-settings`

const ProfileSettings = () => {
  const t = useTranslator(ProfileTranslations)
  const isOld = useIsOld()

  return (
    <>
      <p>{t("accountSettingsInfo")}</p>
      {isOld ? (
        <a href={ACCOUNT_SETTINGS_URL} target="_blank">
          {t("accountSettingsLink")}
        </a>
      ) : (
        <CTALink href={ACCOUNT_SETTINGS_URL} target="_blank">
          {t("accountSettingsLink")}
        </CTALink>
      )}
    </>
  )
}

export default ProfileSettings
