import "@apollo/client"

// Must match defaultOptions in lib/with-apollo-client/get-apollo.ts.
declare module "@apollo/client" {
  namespace ApolloClient {
    namespace DeclareDefaultOptions {
      interface WatchQuery {
        errorPolicy: "all"
      }
      interface Query {
        errorPolicy: "all"
      }
    }
  }
}
