"use client";

import { useCallback, useState } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, opts = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast = {
      id,
      message,
      type: opts.type || "info",
      duration: typeof opts.duration === "number" ? opts.duration : 3500,
      actionLabel: opts.actionLabel,
      onAction: opts.onAction,
    };
    setToasts((prev) => [...prev, toast]);

    if (toast.duration > 0) {
      setTimeout(() => hideToast(id), toast.duration);
    }

    return id;
  }, [hideToast]);

  const showUndo = useCallback((message, onUndo, label = "Undo", duration = 6000) => {
    return showToast(message, { actionLabel: label, onAction: onUndo, duration });
  }, [showToast]);

  return {
    toasts,
    showToast,
    showUndo,
    hideToast,
  };
}
