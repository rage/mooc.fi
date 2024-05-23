import { PropsWithChildren } from "react"

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { ConfirmProvider } from "material-ui-confirm"

import { AlertProvider } from "/contexts/AlertContext"
import { BreadcrumbProvider } from "/contexts/BreadcrumbContext"
import { SnackbarProvider } from "/contexts/SnackbarContext"

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
})

export default function AppContextProvider({ children }: PropsWithChildren) {
  return (
    <ApolloProvider client={client}>
      <ConfirmProvider>
        <BreadcrumbProvider>
          <AlertProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </AlertProvider>
        </BreadcrumbProvider>
      </ConfirmProvider>
    </ApolloProvider>
  )
}
