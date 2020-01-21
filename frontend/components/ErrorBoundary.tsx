import React from "react"

import ErrorMessage from "./ErrorMessage"

type ErrorBoundaryState = {
  hasError: boolean | null | undefined
}

type ErrorBoundaryError = {
  error: Error | null | undefined
}

interface ErrorBoundaryProps {
  children: React.ReactChildren
}

class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = {
    hasError: undefined,
  }
  constructor(props: ErrorBoundaryProps) {
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
