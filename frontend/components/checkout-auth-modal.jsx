"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  LogIn, 
  UserPlus, 
  ArrowRight, 
  Check, 
  Package, 
  Star,
  Shield,
  X
} from "lucide-react";

export default function CheckoutAuthModal({ isOpen, onClose, cartTotal }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    router.push('/auth/sign-in?redirect_url=/cart');
    onClose();
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    router.push('/auth/sign-up?redirect_url=/cart');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1d] border-gray-700 text-white max-w-md mx-4 sm:max-w-lg">
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute text-gray-400 top-4 right-4 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>

        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-3 mx-auto mb-4 rounded-full bg-white/10 w-fit"
          >
            <ShoppingCart className="w-6 h-6 text-white sm:w-8 sm:h-8" />
          </motion.div>

          <DialogTitle className="mb-2 text-xl font-bold text-white sm:text-2xl">
            {t("checkout.modal.title", "Account Required for Checkout")}
          </DialogTitle>
          
          <DialogDescription className="text-sm text-gray-300 sm:text-base">
            {t("checkout.modal.description", "Please create an account or sign in to complete your purchase.")}
            <br />
            {t("checkout.modal.benefits_intro", "Enjoy faster checkout, order tracking, and personalized recommendations.")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Sign-in Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-3 text-sm text-gray-300">
              <span className="font-medium text-white">{t("checkout.modal.benefits_title", "With an account you get")}:</span>
            </div>
            <div className="space-y-2 text-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <Check className="w-3 h-3 text-red-400 sm:w-4 sm:h-4" />
                <span className="text-gray-300">{t("checkout.modal.benefit_faster", "Faster checkout")}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <Package className="w-3 h-3 text-blue-400 sm:w-4 sm:h-4" />
                <span className="text-gray-300">{t("checkout.modal.benefit_tracking", "Track orders & returns")}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <Star className="w-3 h-3 text-yellow-400 sm:w-4 sm:h-4" />
                <span className="text-gray-300">{t("checkout.modal.benefit_offers", "Personalized offers")}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {/* Primary Action - Sign In */}
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-sm font-semibold text-black transition-all duration-200 bg-white hover:bg-gray-100 sm:h-14 sm:text-base"
            >
              <LogIn className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
              {t("auth.sign_in.button", "Σύνδεση")}
              <ArrowRight className="w-4 h-4 ml-auto sm:w-5 sm:h-5" />
            </Button>

            {/* Secondary Action - Sign Up */}
            <Button
              onClick={handleSignUp}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 text-sm font-semibold text-white transition-all duration-200 border-gray-600 hover:bg-gray-800 sm:h-14 sm:text-base"
            >
              <UserPlus className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
              {t("auth.sign_up.button", "Δημιουργία Λογαριασμού")}
              <ArrowRight className="w-4 h-4 ml-auto sm:w-5 sm:h-5" />
            </Button>
          </motion.div>

          {/* Security Reassurance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 mt-6 border border-gray-700 rounded-lg bg-gray-800/50"
          >
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
              <Shield className="w-4 h-4" />
              <span>{t("checkout.modal.security", "Your information is safe and secure")}</span>
            </div>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4 text-xs text-gray-400"
          >
            <button 
              onClick={handleSignIn}
              className="transition-colors hover:text-white"
            >
              {t("checkout.modal.forgot_password", "Forgot password?")}
            </button>
            <span>•</span>
            <button 
              onClick={handleSignUp}
              className="transition-colors hover:text-white"
            >
              {t("checkout.modal.new_here", "New here? Create account")}
            </button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
