import React, { useState } from 'react';

export default function ErrorBoundary({ children, fallback }) {
  const [error, setError] = useState(null);

  if (error) {
    if (typeof fallback === 'function') return fallback(error);
    return (
      <div className="card p-6 m-4 border-red-500 bg-red-50/50 text-red-800">
        <h3 className="font-bold mb-2">⚠️ Xatolik yuz berdi</h3>
        <pre className="text-xs whitespace-pre-wrap break-all">{error.message}</pre>
        <button
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
          className="mt-3 px-3 py-1 text-xs border border-red-500 rounded hover:bg-red-100"
        >
          Qayta yuklash
        </button>
      </div>
    );
  }
  return children;
}
