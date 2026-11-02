import { useEffect, useState } from "react"

import { useApolloClient } from "@apollo/client"

import {
  clearSession,
  getAccessToken,
  isAccessTokenRejected,
  isAdmin,
  isSignedIn,
} from "/lib/authentication"

import {
  CurrentUserDetailedDocument,
  CurrentUserDetailedQuery,
  UserDetailedFieldsFragment,
} from "/graphql/generated"

interface UseAuthResult {
  loading: boolean
  signedIn: boolean
  admin: boolean
  currentUser: UserDetailedFieldsFragment | null
}

export function useAuth(): UseAuthResult {
  const [loading, setLoading] = useState(true)
  const [signedIn, setSignedIn] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [currentUser, setCurrentUser] =
    useState<UserDetailedFieldsFragment | null>(null)
  const apolloClient = useApolloClient()

  useEffect(() => {
    const checkAuth = async () => {
      const isUserSignedIn = isSignedIn()
      const isUserAdmin = isAdmin()

      setSignedIn(isUserSignedIn)
      setAdmin(isUserAdmin)

      if (isUserSignedIn) {
        try {
          const { data } = await apolloClient.query<CurrentUserDetailedQuery>({
            query: CurrentUserDetailedDocument,
            fetchPolicy: "network-only",
          })
          const accessToken = getAccessToken()
          // The backend answers no user both for a dead token and when TMC is down; only the
          // former signs the student out.
          if (
            !data.currentUser &&
            accessToken &&
            (await isAccessTokenRejected(accessToken))
          ) {
            clearSession()
            setSignedIn(false)
            setAdmin(false)
          }
          setCurrentUser(data.currentUser ?? null)
        } catch (error) {
          console.error("Failed to fetch current user:", error)
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }

      setLoading(false)
    }

    checkAuth()
  }, [apolloClient])

  return { loading, signedIn, admin, currentUser }
}
