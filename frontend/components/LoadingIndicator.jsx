
import React from "react"
import { useTranslation } from "react-i18next";

export default function LoadingIndicator({ size = "default", text = null, minimal = false }) {
  const { t } = useTranslation();
  
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-12 w-12",
    large: "h-16 w-16"
  };

  if (minimal) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <svg className={`animate-spin ${sizeClasses[size]} text-[#bfc1c6]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {text && <span className="text-[#bfc1c6] text-sm font-light tracking-wide">{text}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#18181b] bg-opacity-90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <svg className={`animate-spin ${sizeClasses[size]} text-[#bfc1c6]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="text-[#bfc1c6] text-lg font-light tracking-wide">
          {text || t('loading')}
        </span>
      </div>
    </div>
  )
}
