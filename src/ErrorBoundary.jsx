// ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log("Error caught by ErrorBoundary:", error);
    console.log("Error details:", info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong while rendering the scene. Please try again.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
