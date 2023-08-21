import { createUploadLink } from "apollo-upload-client/public/index.mjs"
import deepmerge from "deepmerge"
import extractFiles from "extract-files/extractFiles.mjs"
import isExtractableFile from "extract-files/isExtractableFile.mjs"
import { createClient } from "graphql-ws"
import fetch from "isomorphic-unfetch"
import nookies from "nookies"
import { equals } from "remeda"

import {
  ApolloClient,
  ApolloLink, // defaultDataIdFromObject,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  split,
} from "@apollo/client"
import { BatchHttpLink } from "@apollo/client/link/batch-http"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"

import { isDefinedAndNotEmpty } from "/util/guards"

import { StrictTypedTypePolicies } from "/graphql/generated"

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
    fetchOptions: {
      credentials: "same-origin",
      timeout: 20000,
    },
    headers: {
      "apollo-require-preflight": "true",
    },
  }

  const createBatchHttpLink = (() => {
    let _batchHttpLink: BatchHttpLink
    return (options: BatchHttpLink.Options) => {
      if (!_batchHttpLink) {
        _batchHttpLink = new BatchHttpLink(options)
      }
      return _batchHttpLink
    }
  })()

  // use BatchHttpLink if there are no uploaded files, otherwise use
  // uploadLink that uses simple HttpLink
  const uploadAndBatchHTTPLink = split(
    (operation) => extractFiles(operation, isExtractableFile).files.size > 0,
    createUploadLink(httpLinkOptions),
    createBatchHttpLink(httpLinkOptions),
  )

  const wsLink = isBrowser
    ? new GraphQLWsLink(
        createClient({
          url: production ? "wss://www.mooc.fi/api" : "ws://localhost:4000",
          connectionParams: () => {
            const accessToken = nookies.get()["access_token"]
            if (accessToken) {
              return { authorization: `Bearer ${accessToken}` }
            }
            return {}
          },
        }),
      )
    : null

  const errorLink = onError(
    ({ graphQLErrors, networkError, forward, operation }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
              locations,
            )}, Path: ${path}`,
          ),
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
      return forward(operation)
    },
  )

  const wsAndUploadAndBatchHTTPLink =
    isBrowser && wsLink
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query)
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            )
          },
          wsLink,
          uploadAndBatchHTTPLink,
        )
      : uploadAndBatchHTTPLink

  const metricsLink = new ApolloLink((operation, forward) => {
    const { operationName } = operation
    const startTime = new Date().getTime()
    const subscriber = forward(operation)

    return new Observable((observer) => {
      const subscription = subscriber.subscribe({
        complete: () => {
          const elapsed = new Date().getTime() - startTime
          console.warn(`[METRICS][${operationName}] (${elapsed}) complete`)
          observer.complete()
        },
        next: observer.next.bind(observer),
        error: (error) => {
          return observer.next(error)
        },
      })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    })
  })

  const cache = createCache()

  return new ApolloClient<NormalizedCacheObject>({
    link: isBrowser
      ? ApolloLink.from(
          [authLink, errorLink, localeLink, wsAndUploadAndBatchHTTPLink].filter(
            isDefinedAndNotEmpty,
          ),
        )
      : ApolloLink.from(
          [
            development ? metricsLink : undefined,
            authLink,
            localeLink,
            uploadAndBatchHTTPLink,
          ].filter(isDefinedAndNotEmpty),
        ),
    cache: isBrowser ? cache.restore(initialState ?? {}) : cache,
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

  // Reuse client on the client-side
  // Also force new client if access token has changed because we don't want to risk accidentally
  // serving cached data from the previous user.
  const _apolloClient =
    !userChanged && !localeChanged && isBrowser
      ? apolloClient ?? create(initialState, accessToken, locale)
      : create(undefined, accessToken, locale)

  previousAccessToken = accessToken
  previousLocale = locale

  if (initialState) {
    const existingCache = _apolloClient.extract()
    const data = deepmerge(existingCache, initialState, {
      arrayMerge: (destination: any, source: any) => [
        ...source,
        ...destination.filter((d: any) =>
          source.every((s: any) => !equals(d, s)),
        ),
      ],
    })

    _apolloClient.cache.restore(data)
  }

  if (!isBrowser) {
    return _apolloClient
  }

  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
}

export function initNewApollo(accessToken?: string, locale?: string) {
  apolloClient = create(undefined, accessToken, locale)
  return apolloClient
}
