import React, { createContext, useCallback, useMemo, useState } from "react"

import { AlertColor } from "@mui/material"

export interface SnackbarMessage {
  key: number
  message: string
  open?: boolean
  seen?: boolean
  severity?: AlertColor
}

export interface AddSnackbarArgs {
  message: string
  severity?: AlertColor
}

interface SnackbarContext {
  snackbars: readonly SnackbarMessage[]
}

interface SnackbarMethods {
  addSnackbar: (args: AddSnackbarArgs) => void
  removeSnackbar: (message: SnackbarMessage) => void
  handleClose: (message: SnackbarMessage) => (_: any, reason?: string) => void
  handleExited: (message: SnackbarMessage) => () => void
}

const SnackbarContextImpl = createContext<SnackbarContext>({
  snackbars: [],
})

const SnackbarMethodsContextImpl = createContext<SnackbarMethods>({
  addSnackbar: () => void 0,
  removeSnackbar: () => void 0,
  handleClose: () => () => void 0,
  handleExited: () => () => void 0,
})

export const SnackbarProvider = ({ children }: React.PropsWithChildren) => {
  const [snackbars, setSnackbars] = useState<readonly SnackbarMessage[]>([])

  const setSnackbarOpenStatus = useCallback(
    (message: SnackbarMessage, open: boolean) => {
      setSnackbars((prev) =>
        prev.map((snackbar) =>
          snackbar.key === message.key ? { ...snackbar, open } : snackbar,
        ),
      )
    },
    [setSnackbars],
  )

  const removeSnackbar = useCallback(
    (message: SnackbarMessage) => {
      setSnackbars((prev) =>
        prev.filter((snackbar) => snackbar.key !== message.key),
      )
    },
    [setSnackbars],
  )

  const handleClose = useCallback(
    (message: SnackbarMessage) => (_: any, reason?: string) => {
      if (reason === "clickaway") {
        return
      }
      setSnackbarOpenStatus(message, false)
    },
    [setSnackbarOpenStatus],
  )

  const handleExited = useCallback(
    (message: SnackbarMessage) => () => {
      removeSnackbar(message)
    },
    [removeSnackbar],
  )

  const addSnackbar = useCallback(
    ({ message, severity }: AddSnackbarArgs) => {
      setSnackbars((prev) => [
        ...prev,
        { key: new Date().getTime(), message, severity, open: true },
      ])
    },
    [setSnackbars],
  )

  const contextValue = useMemo(
    () => ({
      snackbars,
    }),
    [snackbars],
  )

  const contextMethods = useMemo(
    () => ({
      addSnackbar,
      removeSnackbar,
      handleClose,
      handleExited,
    }),
    [addSnackbar],
  )

  return (
    <SnackbarContextImpl.Provider value={contextValue}>
      <SnackbarMethodsContextImpl.Provider value={contextMethods}>
        {children}
      </SnackbarMethodsContextImpl.Provider>
    </SnackbarContextImpl.Provider>
  )
}

export const useSnackbarContext = () => {
  return React.useContext(SnackbarContextImpl)
}

export const useSnackbarMethods = () => {
  return React.useContext(SnackbarMethodsContextImpl)
}

export {
  SnackbarContextImpl as SnackbarContext,
  SnackbarMethodsContextImpl as SnackbarMethods,
}
