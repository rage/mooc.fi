import { createUploadLink } from "apollo-upload-client"
import fetch from "isomorphic-unfetch"
import nookies from "nookies"

import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const production = process.env.NODE_ENV === "production"
const cypress = process.env.CYPRESS === "true"

/* const cypress =
  process.env.CYPRESS === "true" ||
  (typeof window !== "undefined" &&
    window.Cypress &&
    window.Cypress.env("CYPRESS") === "true") */

function create(initialState: any, originalAccessToken?: string) {
  const authLink = setContext((_, { headers }) => {
    // Always get the current access token from cookies in case it has changed
    let accessToken: string | undefined = nookies.get()["access_token"]
    if (!accessToken && typeof window === "undefined") {
      accessToken = originalAccessToken
    }

    const headersCopy = { ...headers }
    if (accessToken) {
      headersCopy.authorization = `Bearer ${accessToken}`
    }

    return {
      headers: headersCopy,
    }
  })

  // replaces standard HttpLink
  const uploadLink = createUploadLink({
    uri: cypress
      ? "http://localhost:4001"
      : production
      ? "https://www.mooc.fi/api/"
      : "http://localhost:4000",
    credentials: "same-origin",
    fetch,
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${path}`,
        ),
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  // these cache settings are mainly for the breadcrumbs
  const cache: InMemoryCache = new InMemoryCache({
    dataIdFromObject: (object: any) => {
      switch (object.__typename) {
        case "Course":
          return `Course:${object.slug}:${object.id}`
        case "StudyModule":
          return `StudyModule:${object.slug}:${object.id}`
        default:
          return defaultDataIdFromObject(object)
      }
    },
  })

  return new ApolloClient<NormalizedCacheObject>({
    link:
      typeof window === "undefined"
        ? authLink.concat(uploadLink)
        : ApolloLink.from([errorLink, authLink.concat(uploadLink)]),
    cache: cache.restore(initialState || {}),
    ssrMode: typeof window === "undefined",
    ssrForceFetchDelay: 100,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-first", //"no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "cache-first", //"no-cache",
        errorPolicy: "all",
      },
    },
  })
}

let previousAccessToken: string | undefined = undefined

export default function getApollo(initialState: any, accessToken?: string) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return create(initialState, accessToken)
  }

  // Reuse client on the client-side
  // Also force new client if access token has changed because we don't want to risk accidentally
  // serving cached data from the previous user.
  if (!apolloClient || accessToken !== previousAccessToken) {
    apolloClient = create(initialState, accessToken)
  }

  previousAccessToken = accessToken

  return apolloClient
}

export function initNewApollo(accessToken?: string) {
  apolloClient = create(undefined, accessToken)
  return apolloClient
}
