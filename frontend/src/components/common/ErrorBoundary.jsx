import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid h-full min-h-0 place-items-center rounded-[2rem] border border-white/10 bg-rose-900/10 p-6 text-center text-rose-100 shadow-2xl shadow-black/30">
          <div className="max-w-lg">
            <h3 className="text-2xl font-semibold">Something went wrong</h3>
            <p className="mt-3 text-sm leading-7 text-rose-200">We encountered an unexpected error initializing the video experience. Try refreshing the page or leaving and rejoining the call.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
