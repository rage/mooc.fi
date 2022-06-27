import {
  ApolloClient,
  ApolloLink,
  defaultDataIdFromObject,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { relayStylePagination } from "@apollo/client/utilities"
import { createUploadLink } from "apollo-upload-client"
import fetch from "isomorphic-unfetch"
import { isEqual, merge } from "lodash"
import nookies from "nookies"

const production = process.env.NODE_ENV === "production"
const isClient = typeof window !== "undefined"

// @ts-ignore: looking on how cache/accesstoken/state should be used
function createApolloClient(initialState: any, originalAccessToken?: string) {
  const authLink = setContext((_, { headers }) => {
    // Always get the current access token from cookies in case it has changed
    let accessToken: string | undefined = nookies.get()["access_token"]
    if (!accessToken && !isClient) {
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
          // fetchMore: merge incoming to existing edges
          userCourseSettings: relayStylePagination(),
        },
      },
    },
  })

  return new ApolloClient<NormalizedCacheObject>({
    link: isClient
      ? ApolloLink.from([errorLink, authLink.concat(uploadLink)])
      : authLink.concat(uploadLink),
    cache, // : cache.restore(initialState || {}),
    ssrMode: !isClient, // isBrowser,
    // ssrForceFetchDelay: 100,
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
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

export default function initApollo(initialState: any, accessToken?: string) {
  if (!isClient) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    return createApolloClient(undefined, accessToken)
  }

  // Reuse client on the client-side
  // Also force new client if access token has changed because we don't want to risk accidentally
  // serving cached data from the previous user.
  let _apolloClient =
    accessToken === previousAccessToken && apolloClient
      ? apolloClient
      : createApolloClient(initialState, accessToken)

  previousAccessToken = accessToken

  if (initialState) {
    const existingCache = _apolloClient.extract()
    const data = merge(existingCache, initialState, {
      arrayMerge: (destination: any, source: any) => [
        ...source,
        ...destination.filter((d: any) =>
          source.every((s: any) => !isEqual(d, s)),
        ),
      ],
    })

    _apolloClient.cache.restore(data)
  }

  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
