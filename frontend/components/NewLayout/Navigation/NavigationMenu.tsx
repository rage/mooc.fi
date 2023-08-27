import { useMemo } from "react"

import { isDefined } from "remeda"

import {
  DesktopNavigationMenu,
  MobileNavigationMenu,
  NavigationMenuItem,
} from "."
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const NavigationMenu = () => {
  const t = useTranslator(CommonTranslations)
  const { admin } = useLoginStateContext()

  const items =
    useMemo<Array<NavigationMenuItem>>(
      () =>
        [
          {
            label: t("courses"),
            href: "/_new/courses",
          },
          {
            label: t("modules"),
            href: "/_new/study-modules",
          },
          admin
            ? {
                label: "Admin",
                href: "/_new/admin",
                items: [
                  {
                    href: "/_new/admin/courses",
                    label: t("courses"),
                  },
                  {
                    href: "/_new/admin/study-modules",
                    label: t("modules"),
                  },
                  {
                    href: "/_new/admin/email-templates",
                    label: t("emailTemplates"),
                  },
                  {
                    href: "/_new/admin/users/search",
                    label: t("userSearch"),
                  },
                ],
              }
            : null,
        ].filter(isDefined),
      [t, admin],
    ) ?? []

  return (
    <>
      <DesktopNavigationMenu items={items} />
      <MobileNavigationMenu items={items} />
    </>
  )
}

export default NavigationMenu
