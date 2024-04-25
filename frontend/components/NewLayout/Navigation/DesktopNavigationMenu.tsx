import React, { useCallback } from "react"

import { useApolloClient } from "@apollo/client"
import { styled } from "@mui/material/styles"

import { NavigationMenuItem } from "."
import { NavigationLinks } from "./NavigationLinks"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useTranslator } from "/hooks/useTranslator"
import { signOut } from "/lib/authentication"
import CommonTranslations from "/translations/common"

const NavigationRightContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  justify-content: flex-end;
  height: 100%;
  ${theme.breakpoints.down("lg")} {
    display: none;
  }
`,
)

const NavigationContainer = styled("div")`
  display: flex;
  margin: 0 32px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 100%;
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
    (e: MouseEvent) => {
      e.preventDefault()
      signOut(apollo, logInOrOut)
    },
    [apollo, logInOrOut],
  )

  if (loggedIn) {
    return (
      <NavigationLinks
        items={[
          {
            href: "/profile",
            label: t("myProfile"),
            items: [
              {
                href: "",
                label: t("logout"),
                onClick: onLogOut,
              },
            ],
          },
        ]}
      />
    )
  }

  return (
    <NavigationLinks
      items={[
        {
          href: "/sign-in",
          label: t("loginShort"),
        },
        {
          href: "/sign-up",
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
    <NavigationContainer>
      <NavigationLinks items={items} />
      <NavigationRightContainer>
        <UserOptionsMenu />
      </NavigationRightContainer>
    </NavigationContainer>
  )
}

export default DesktopNavigationMenu
