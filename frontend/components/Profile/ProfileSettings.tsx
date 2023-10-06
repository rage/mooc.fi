import CTALink from "../NewLayout/Common/CTALink"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

const ProfileSettings = () => {
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      <p>{t("TMCSettingsInfo")}</p>
      <CTALink href="https://tmc.mooc.fi/participants/me" target="_blank">
        {t("TMCProfileLink")}
      </CTALink>
    </>
  )
}

export default ProfileSettings
