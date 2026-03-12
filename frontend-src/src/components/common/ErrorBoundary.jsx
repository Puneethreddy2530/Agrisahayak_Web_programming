import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected UI error' }
  }

  componentDidCatch(error, errorInfo) {
    // Keep a console trace for production debugging.
    console.error('UI crash captured by ErrorBoundary', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-screen bg-bg text-text-1 flex items-center justify-center p-6">
        <div className="card w-full max-w-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-text-3 text-sm mb-4">
            The app hit an unexpected error. Reload to recover.
          </p>
          <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 break-words">
            {this.state.errorMessage}
          </p>
          <button className="btn-primary" onClick={this.handleReload}>
            Reload App
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
