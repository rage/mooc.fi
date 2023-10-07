import CTALink from "../NewLayout/Common/CTALink"
import useIsOld from "/hooks/useIsOld"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

const ProfileSettings = () => {
  const t = useTranslator(ProfileTranslations)
  const isOld = useIsOld()

  return (
    <>
      <p>{t("TMCSettingsInfo")}</p>
      {isOld ? (
        <a href="https://tmc.mooc.fi/participants/me" target="_blank">
          {t("TMCProfileLink")}
        </a>
      ) : (
        <CTALink href="https://tmc.mooc.fi/participants/me" target="_blank">
          {t("TMCProfileLink")}
        </CTALink>
      )}
    </>
  )
}

export default ProfileSettings
