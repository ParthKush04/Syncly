import React, { useEffect, useState } from 'react';

export default function GlobalErrorCatcher({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    function handleError(message, source, lineno, colno, err) {
      console.error('[GlobalErrorCatcher] window.onerror', { message, source, lineno, colno, err });
      setError(err || { message });
      return false; // allow default handler too
    }

    function handleRejection(ev) {
      console.error('[GlobalErrorCatcher] unhandledrejection', ev.reason);
      setError(ev.reason || { message: 'Unhandled promise rejection' });
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6">
        <div className="max-w-2xl rounded-2xl bg-rose-900/90 p-6 text-white shadow-2xl">
          <h3 className="text-2xl font-semibold">An unexpected error occurred</h3>
          <p className="mt-3 text-sm">We encountered an error initializing the video experience. Try refreshing or leaving and rejoining the call.</p>
          <pre className="mt-4 max-h-60 overflow-auto text-xs bg-black/30 p-3 rounded">{String(error?.message || error)}</pre>
          <div className="mt-4 flex justify-end">
            <button className="rounded bg-white/10 px-4 py-2" onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
