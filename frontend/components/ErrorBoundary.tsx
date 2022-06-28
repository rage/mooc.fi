import { Component, PropsWithChildren } from "react"

import ErrorMessage from "./ErrorMessage"

type ErrorBoundaryState = {
  hasError: boolean | null | undefined
}

type ErrorBoundaryError = {
  error: Error | null | undefined
}

class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: undefined,
  }

  constructor(props: PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: ErrorBoundaryError) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage />
    }
    return this.props.children
  }
}

export default ErrorBoundary
