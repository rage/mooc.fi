import { ChangeEvent, PropsWithChildren } from "react"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"
import { Tab, Tabs } from "@material-ui/core"

interface ProfileTabsProps {
  selected: number
  onChange: (_: ChangeEvent<{}>, __: number) => void
}

function ProfileTabs({
  selected,
  onChange,
  children,
}: PropsWithChildren<ProfileTabsProps>) {
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      <Tabs value={selected} onChange={onChange} aria-label={t("tabAriaLabel")}>
        <Tab
          label={t("tabPoints")}
          id="user-profile-tab-0"
          aria-controls="user-profile-tab-0"
        />
        <Tab
          label={t("tabCompletions")}
          id="user-profile-tab-1"
          aria-controls="user-profile-tab-1"
        />
        <Tab
          label={t("tabSettings")}
          id="user-profile-tab-2"
          aria-controls="user-profile-tab-2"
        />
      </Tabs>
      {children}
    </>
  )
}

export default ProfileTabs
