import React from "react"

export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#18181b] bg-opacity-90">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin h-12 w-12 text-[#bfc1c6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="text-[#bfc1c6] text-lg font-light tracking-wide">Φόρτωση...</span>
      </div>
    </div>
  )
}
