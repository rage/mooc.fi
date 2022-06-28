import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { createUploadLink } from "apollo-upload-client"
import fetch from "isomorphic-unfetch"
import nookies from "nookies"

import notEmpty from "/util/notEmpty"

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const production = process.env.NODE_ENV === "production"

function create(initialState: any, originalAccessToken?: string) {
  const authLink = setContext((_, { headers }) => {
    // Always get the current access token from cookies in case it has changed
    let accessToken: string | undefined = nookies.get()["access_token"]
    if (!accessToken && !process.browser) {
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
    uri: production ? "https://www.mooc.fi/api/" : "http://localhost:4000",
    credentials: "same-origin",
    fetch: fetch,
  })

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
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
    typePolicies: {
      Query: {
        fields: {
          userCourseSettings: {
            // for "fetch more" type querying of user points
            keyArgs: false,
            merge: (existing, incoming) => {
              const existingEdges = (existing?.edges ?? []).filter(notEmpty)
              const incomingEdges = (incoming?.edges ?? []).filter(notEmpty)
              const pageInfo = incoming?.pageInfo ?? {
                hasNextPage: false,
                endCursor: null,
                __typename: "PageInfo",
              }

              const edges = [...existingEdges, ...incomingEdges]

              return {
                pageInfo,
                edges,
                totalCount: incoming?.totalCount ?? null,
              }
            },
          },
        },
      },
    },
  })

  return new ApolloClient<NormalizedCacheObject>({
    link: process.browser
      ? ApolloLink.from([errorLink, authLink.concat(uploadLink)])
      : authLink.concat(uploadLink),
    cache: cache.restore(initialState || {}),
    ssrMode: !process.browser, // isBrowser,
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
  if (!process.browser) {
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
