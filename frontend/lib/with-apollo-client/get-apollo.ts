import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs"
import deepmerge from "deepmerge"
import extractFiles from "extract-files/extractFiles.mjs"
import isExtractableFile from "extract-files/isExtractableFile.mjs"
import { createClient } from "graphql-ws"
import fetch from "isomorphic-unfetch"
import nookies from "nookies"
import { isDeepEqual } from "remeda"

import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client"
import { BatchHttpLink } from "@apollo/client/link/batch-http"
import { SetContextLink } from "@apollo/client/link/context"
import { ErrorLink } from "@apollo/client/link/error"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"

import { BACKEND_URL } from "/lib/backendUrl"
import { isDefinedAndNotEmpty } from "/util/guards"

import { StrictTypedTypePolicies } from "/graphql/generated"

let apolloClient: ApolloClient | null = null

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
  skipSsrFetch?: boolean,
) {
  const authLink = new SetContextLink(({ headers }) => {
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

  const localeLink = new SetContextLink(({ headers }) => {
    const headersCopy = { ...headers }
    if (locale) {
      headersCopy["accept-language"] = locale
    }
    return {
      headers: headersCopy,
    }
  })

  const httpLinkOptions: ConstructorParameters<typeof UploadHttpLink>[0] &
    BatchHttpLink.Options = {
    uri: production ? `${BACKEND_URL}/api/` : BACKEND_URL,
    credentials: "same-origin",
    fetch,
    fetchOptions: {
      credentials: "same-origin",
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
  const uploadAndBatchHTTPLink = ApolloLink.split(
    (operation) => extractFiles(operation, isExtractableFile).files.size > 0,
    new UploadHttpLink(httpLinkOptions),
    createBatchHttpLink(httpLinkOptions),
  )

  const wsLink = isBrowser
    ? new GraphQLWsLink(
        createClient({
          url: production
            ? `${BACKEND_URL.replace(/^http/, "ws")}/api`
            : BACKEND_URL.replace(/^http/, "ws"),
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

  const errorLink = new ErrorLink(({ error }) => {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations,
          )}, Path: ${path}`,
        ),
      )
    } else {
      console.log(`[Network error]: ${error}`)
    }
  })

  const wsAndUploadAndBatchHTTPLink =
    isBrowser && wsLink
      ? ApolloLink.split(
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
        error: observer.error.bind(observer),
      })

      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    })
  })

  const skipSsrFetchLink = new ApolloLink(() => {
    return new Observable((observer) => {
      observer.next({ data: null })
      observer.complete()
    })
  })

  const cache = createCache()

  return new ApolloClient({
    link: isBrowser
      ? ApolloLink.from(
          [authLink, errorLink, localeLink, wsAndUploadAndBatchHTTPLink].filter(
            isDefinedAndNotEmpty,
          ),
        )
      : skipSsrFetch
        ? skipSsrFetchLink
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
        errorPolicy: "all",
        // Apollo 4 defaults to true; components here treat `loading` as "no data yet".
        notifyOnNetworkStatusChange: false,
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
  skipSsrFetch?: boolean,
) {
  const userChanged = accessToken !== previousAccessToken
  const localeChanged = locale !== previousLocale

  // Reuse client on the client-side
  // Also force new client if access token has changed because we don't want to risk accidentally
  // serving cached data from the previous user.
  const _apolloClient =
    !userChanged && !localeChanged && isBrowser
      ? (apolloClient ?? create(initialState, accessToken, locale))
      : create(undefined, accessToken, locale, skipSsrFetch)

  previousAccessToken = accessToken
  previousLocale = locale

  if (initialState && isBrowser) {
    const existingCache = _apolloClient.extract() as NormalizedCacheObject
    const data = deepmerge(existingCache, initialState, {
      arrayMerge: (destination: any, source: any) => [
        ...source,
        ...destination.filter((d: any) =>
          source.every((s: any) => !isDeepEqual(d, s)),
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
