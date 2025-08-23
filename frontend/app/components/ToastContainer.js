"use client";

import React from "react";

export default function ToastContainer({ toasts = [], hideToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-6 z-50 space-y-2 w-[320px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center justify-between p-3 rounded-md shadow-md bg-gray-900 text-white`}
          role="status"
          aria-live="polite"
        >
          <div className="flex-1 text-sm mr-3">{t.message}</div>
          {t.actionLabel ? (
            <button
              className="text-sm text-blue-300 underline ml-2"
              onClick={() => {
                try {
                  t.onAction && t.onAction();
                } catch (e) {}
                hideToast(t.id);
              }}
            >
              {t.actionLabel}
            </button>
          ) : (
            <button
              aria-label="Dismiss"
              className="text-sm text-gray-400 ml-2"
              onClick={() => hideToast(t.id)}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
