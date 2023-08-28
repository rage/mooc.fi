import React, { useCallback } from "react"

import { useApolloClient } from "@apollo/client"
import { styled } from "@mui/material/styles"

import { NavigationMenuItem } from "."
import { NavigationLinks } from "./NavigationLinks"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"

const NavigationRightContainer = styled("div")`
  display: inline-grid;
  gap: 4px;
  grid-template-columns: repeat(3, auto);
  justify-content: flex-end;
`

const UserOptionsMenu = () => {
  const apollo = useApolloClient()
  const { loggedIn, logInOrOut } = useLoginStateContext()
  const t = useTranslator(CommonTranslations)

  /*const userDisplayName = useMemo(() => {
    if (isNarrow) {
      return null
    }
    const name = currentUser?.full_name
    const initials = (
      (currentUser?.first_name?.[0] ?? "") + (currentUser?.last_name?.[0] ?? "")
    ).toLocaleUpperCase()

    if (!name) {
      return t("myProfile")
    }
    if (name.length > 20) {
      return initials
    }

    return name
  }, [currentUser, t, isNarrow])
*/
  const onLogOut = useCallback(
    () => signOut(apollo, logInOrOut),
    [apollo, logInOrOut],
  )

  if (loggedIn) {
    return (
      <NavigationLinks
        items={[
          {
            href: "/_new/profile",
            label: t("myProfile"),
          },
          {
            href: "#",
            label: t("logout"),
            onClick: onLogOut,
          },
        ]}
      />
    )
  }

  return (
    <NavigationLinks
      items={[
        {
          href: "/_new/sign-in",
          label: t("loginShort"),
        },
        {
          href: "/_new/sign-up",
          label: t("signUp"),
        },
      ]}
    />
  )
}

interface DesktopNavigationMenuProps {
  items: Array<NavigationMenuItem>
}

const DesktopNavigationMenu = ({ items }: DesktopNavigationMenuProps) => {
  return (
    <>
      <NavigationLinks items={items} />
      <NavigationRightContainer>
        <UserOptionsMenu />
      </NavigationRightContainer>
    </>
  )
}

export default DesktopNavigationMenu
