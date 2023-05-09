import React, { createContext, useMemo, useState } from "react"

import { AlertColor } from "@mui/material"
import { useEventCallback } from "@mui/material/utils"

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

type SnackbarContext = readonly SnackbarMessage[]
interface SnackbarMethods {
  addSnackbar: (args: AddSnackbarArgs) => void
  removeSnackbar: (message: SnackbarMessage) => void
  handleClose: (message: SnackbarMessage) => (_: any, reason?: string) => void
  handleExited: (message: SnackbarMessage) => () => void
}

const SnackbarContextImpl = createContext<SnackbarContext>([])

function Nop() {
  /**/
}

const SnackbarMethodsContextImpl = createContext<SnackbarMethods>({
  addSnackbar: Nop,
  removeSnackbar: Nop,
  handleClose: function () {
    return Nop
  },
  handleExited: function () {
    return Nop
  },
})

export const SnackbarProvider = ({ children }: React.PropsWithChildren) => {
  const [snackbars, setSnackbars] = useState<readonly SnackbarMessage[]>([])

  const setSnackbarOpenStatus = useEventCallback(
    (message: SnackbarMessage, open: boolean) => {
      setSnackbars((prev) =>
        prev.map((snackbar) =>
          snackbar.key === message.key ? { ...snackbar, open } : snackbar,
        ),
      )
    },
  )

  const removeSnackbar = useEventCallback((message: SnackbarMessage) => {
    setSnackbars((prev) =>
      prev.filter((snackbar) => snackbar.key !== message.key),
    )
  })

  const handleClose = useEventCallback(
    (message: SnackbarMessage) => (_: any, reason?: string) => {
      if (reason === "clickaway") {
        return
      }
      setSnackbarOpenStatus(message, false)
    },
  )

  const handleExited = useEventCallback((message: SnackbarMessage) => () => {
    removeSnackbar(message)
  })

  const addSnackbar = useEventCallback(
    ({ message, severity }: AddSnackbarArgs) => {
      setSnackbars((prev) => [
        ...prev,
        { key: new Date().getTime(), message, severity, open: true },
      ])
    },
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
    <SnackbarContextImpl.Provider value={snackbars}>
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
