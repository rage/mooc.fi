import CTALink from "../NewLayout/Common/CTALink"
import useIsNew from "/hooks/useIsNew"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

const ProfileSettings = () => {
  const t = useTranslator(ProfileTranslations)
  const isNew = useIsNew()

  return (
    <>
      <p>{t("TMCSettingsInfo")}</p>
      {isNew ? (
        <CTALink href="https://tmc.mooc.fi/participants/me" target="_blank">
          {t("TMCProfileLink")}
        </CTALink>
      ) : (
        <a href="https://tmc.mooc.fi/participants/me" target="_blank">
          {t("TMCProfileLink")}
        </a>
      )}
    </>
  )
}

export default ProfileSettings
