import withApollo from "next-with-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { getAccessToken } from "./authentication";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

export default withApollo(({ ctx, initialState }) => {
  const httpLink = createHttpLink({
    uri: "http://localhost:4000",
    credentials: "same-origin"
  });

  const authLink = setContext((_, { headers }) => {
    const token = getAccessToken(ctx);
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
      }
    };
  });

  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      authLink.concat(httpLink)
    ]),
    cache: new InMemoryCache().restore(initialState || {})
  });
});
