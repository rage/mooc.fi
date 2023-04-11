import { createUploadLink } from "apollo-upload-client/public/index.mjs"
import extractFiles from "extract-files/extractFiles.mjs"
import isExtractableFile from "extract-files/isExtractableFile.mjs"
import fetch from "isomorphic-unfetch"
import nookies from "nookies"

import {
  ApolloClient,
  ApolloLink, // defaultDataIdFromObject,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client"
import { BatchHttpLink } from "@apollo/client/link/batch-http"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

import notEmpty from "/util/notEmpty"

import { StrictTypedTypePolicies } from "/graphql/generated/apollo-helpers"

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

const production = process.env.NODE_ENV === "production"
const development = !production && process.env.NODE_ENV !== "test"
const isBrowser = typeof window !== "undefined"

// these cache settings are mainly for the breadcrumbs
const typePolicies: StrictTypedTypePolicies = {
  Course: {
    keyFields: ["slug", "id", "name"],
  },
  StudyModule: {
    keyFields: ["slug", "id", "name"],
  },
  Query: {
    fields: {
      userCourseSettings: {
        // for "fetch more" type querying of user points
        keyArgs: false,
        merge: (existing, incoming) => {
          const existingEdges = existing?.edges ?? []
          const incomingEdges = incoming?.edges ?? []
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
}

const createCache = () =>
  new InMemoryCache({
    typePolicies,
  })

let cache = createCache()

function create(
  initialState: any,
  originalAccessToken?: string,
  locale?: string,
) {
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

  const localeLink = setContext((_, { headers }) => {
    const headersCopy = { ...headers }
    if (locale) {
      headersCopy["accept-language"] = locale
    }
    return {
      headers: headersCopy,
    }
  })

  const httpLinkOptions: Parameters<typeof createUploadLink>[0] &
    BatchHttpLink.Options = {
    uri: production ? "https://www.mooc.fi/api/" : "http://localhost:4000",
    credentials: "same-origin",
    fetch,
    headers: {
      "apollo-require-preflight": "true",
    },
  }

  // use BatchHttpLink if there are no uploaded files, otherwise use
  // uploadLink that uses simple HttpLink
  const uploadAndBatchHTTPLink = ApolloLink.split(
    (operation) => extractFiles(operation, isExtractableFile).files.size > 0,
    createUploadLink(httpLinkOptions),
    new BatchHttpLink(httpLinkOptions),
  )

  const metricsLink = new ApolloLink((operation, forward) => {
    const { operationName } = operation
    const startTime = new Date().getTime()
    const observable = forward(operation)

    // Return a new observable so no other links can call .subscribe on the
    // the one that we were passed.
    return new Observable((observer) => {
      observable.subscribe({
        complete: () => {
          const elapsed = new Date().getTime() - startTime
          console.warn(`[METRICS][${operationName}] (${elapsed}) complete`)
          observer.complete()
        },
        next: observer.next.bind(observer),
        error: (error) => {
          // ...
          observer.error(error)
        },
      })
    })
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

  return new ApolloClient<NormalizedCacheObject>({
    link: isBrowser
      ? ApolloLink.from([
          errorLink,
          authLink,
          localeLink,
          uploadAndBatchHTTPLink,
        ])
      : ApolloLink.from(
          [
            development ? metricsLink : undefined,
            authLink,
            localeLink,
            uploadAndBatchHTTPLink,
          ].filter(notEmpty),
        ),
    cache: isBrowser ? cache.restore(initialState ?? {}) : createCache(),
    ssrMode: !isBrowser,
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
let previousLocale: string | undefined = undefined

export default function getApollo(
  initialState: any,
  accessToken?: string,
  locale?: string,
) {
  const userChanged = accessToken !== previousAccessToken
  const localeChanged = locale !== previousLocale

  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, accessToken, locale)
  }

  // Reuse client on the client-side
  // Also force new client if access token has changed because we don't want to risk accidentally
  // serving cached data from the previous user.
  if (!apolloClient || userChanged || localeChanged) {
    cache = createCache()
    apolloClient = create(initialState, accessToken, locale)
  }

  previousAccessToken = accessToken
  previousLocale = locale

  return apolloClient
}

export function initNewApollo(accessToken?: string, locale?: string) {
  apolloClient = create(undefined, accessToken, locale)
  return apolloClient
}
