"use client";

import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search...",
  variant = "default", // "default" or "minimal"
  autoFocus = false,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${
        variant === "minimal"
          ? "w-full max-w-md"
          : "w-full max-w-md bg-[#232326] rounded-lg shadow-lg"
      } ${className}`}
    >
      <motion.div
        className={`relative flex items-center w-full gap-2 px-3 ${
          variant === "minimal"
            ? "bg-transparent"
            : "bg-[#18181b] border border-[#bcbcbc33] rounded-lg"
        }`}
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(255,255,255,0.1)"
            : "0 0 0 0px rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.2 }}
      >
        <Search
          className={`w-5 h-5 ${
            variant === "minimal" ? "text-slate-400" : "text-slate-300"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`flex-1 py-2 text-sm bg-transparent border-none outline-none ${
            variant === "minimal"
              ? "text-slate-900 placeholder:text-slate-400"
              : "text-slate-100 placeholder:text-slate-400"
          }`}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => {
                onClear?.();
                inputRef.current?.focus();
              }}
              className={`p-1 rounded-full hover:bg-slate-700/50 ${
                variant === "minimal"
                  ? "text-slate-400 hover:text-slate-600"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  );
};

export default SearchBar;
