import { PropsWithChildren, SyntheticEvent } from "react"

import { Tab, Tabs } from "@mui/material"

import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

interface ProfileTabsProps {
  selected: number
  onChange: (_: SyntheticEvent<Element, Event>, __: number) => void
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
