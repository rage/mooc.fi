import { PropsWithChildren } from "react"

import { ConfirmProvider } from "material-ui-confirm"

import { AlertProvider } from "/contexts/AlertContext"
import { BreadcrumbProvider } from "/contexts/BreadcrumbContext"
import { SnackbarProvider } from "/contexts/SnackbarContext"

export default function AppContextProvider({ children }: PropsWithChildren) {
  return (
    <ConfirmProvider>
      <BreadcrumbProvider>
        <AlertProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </AlertProvider>
      </BreadcrumbProvider>
    </ConfirmProvider>
  )
}
