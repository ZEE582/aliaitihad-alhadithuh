import { strings as S } from "../constants/strings";
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center"
          dir="rtl"
        >
          <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
            <div className="text-6xl mb-4">{S.errorBoundary.errorIcon}</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">{S.errorBoundary.errorTitle}</h1>
            <p className="text-gray-500 text-sm mb-6">
              {S.errorBoundary.errorMessage}
            </p>

            {this.state.error && (
              <details className="text-right mb-6">
                <summary className="text-xs text-gray-400 cursor-pointer mb-1">{S.errorBoundary.errorDetails}</summary>
                <pre className="text-xs text-red-400 bg-red-50 rounded p-3 overflow-auto max-h-32 text-left">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {S.errorBoundary.retryButton}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {S.errorBoundary.reloadButton}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;