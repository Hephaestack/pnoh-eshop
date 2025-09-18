"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function ContactModal({ open, success = true, message = '', onClose = () => {} }) {
  const { t } = useTranslation();
  // Auto-close after 2 seconds when opened
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Blurred backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            key="modal"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.28, ease: 'circOut' } }}
            exit={{ y: 8, opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="bg-[#23232a] border border-[#bfc1c6] rounded-lg p-6 text-[#e5e7eb] shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {success ? (
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  ) : (
                    <XCircle className="w-10 h-10 text-red-400" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">{success ? t('contact_modal.message_sent') : t('contact_modal.send_failed')}</h3>
                  <p className="text-sm text-[#bfc1c6] mb-4">{message}</p>

                  <div className="flex justify-end">
                    <Button size="sm" className="bg-[#23232a] border border-[#bfc1c6]" onClick={onClose}>
                      {t('contact_modal.close')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
