import React, { useState } from "react";
import { Check, CheckCircle2, Sparkles, ArrowRight, Zap, Shield, HardDrive, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { saveUserPlanToFirestore, DEFAULT_PLANS } from "../firebase/config";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelected?: (plan: "free" | "premium") => void;
  title?: string;
  subtitle?: string;
}

export function PlanSelectionModal({ 
  isOpen, 
  onClose, 
  onSelected,
  title = "Welcome! Select Your Minecraft Plan",
  subtitle = "Choose a hosting tier to get started. You can upgrade or modify your plan anytime in Account settings."
}: PlanSelectionModalProps) {
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Save to backend users database
      const res = await axios.put("/api/auth/plan", { plan: selectedPlan });
      
      // 2. Save to Firebase Cloud Firestore
      if (user?.id) {
        await saveUserPlanToFirestore(user.id, selectedPlan, user.email, user.username);
      }

      // 3. Update Auth context
      updateUser({ plan: selectedPlan, planSelectedAt: new Date().toISOString() });

      if (onSelected) {
        onSelected(selectedPlan);
      }
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      console.error("Failed to set user plan:", err);
      setError(err.response?.data?.error || err.message || "Failed to save selected plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono uppercase tracking-wider mb-3">
              <Sparkles size={14} />
              First Login Setup
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
            <p className="text-slate-400 text-sm mt-2">{subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Free Plan */}
            <div
              onClick={() => setSelectedPlan("free")}
              className={`p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === "free"
                  ? "bg-slate-800/80 border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-slate-800 text-slate-300">
                    Community
                  </span>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    selectedPlan === "free" ? "border-rose-500 bg-rose-500 text-white" : "border-slate-700"
                  }`}>
                    {selectedPlan === "free" && <Check size={14} />}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">Free Tier</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Everything you need to run your private Minecraft world with friends.
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400">/ forever</span>
                </div>

                <div className="space-y-2.5">
                  {DEFAULT_PLANS.free.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>1 Server Max</span>
                <span>2 GB RAM</span>
              </div>
            </div>

            {/* Premium Plan */}
            <div
              onClick={() => setSelectedPlan("premium")}
              className={`p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                selectedPlan === "premium"
                  ? "bg-gradient-to-b from-slate-800 to-slate-900 border-rose-500 shadow-xl shadow-rose-500/20 scale-[1.01]"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider">
                Recommended
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono uppercase bg-rose-500/20 text-rose-300">
                    Pro Network
                  </span>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    selectedPlan === "premium" ? "border-rose-500 bg-rose-500 text-white" : "border-slate-700"
                  }`}>
                    {selectedPlan === "premium" && <Check size={14} />}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">Premium Pro</h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  For heavy modpacks, large multiplayer SMPs, and multi-server networks.
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-extrabold text-white">$9.99</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <div className="space-y-2.5">
                  {DEFAULT_PLANS.premium.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 size={15} className="text-rose-400 shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>10 Servers Max</span>
                <span>Up to 16 GB RAM</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirmPlan}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Plan to Firestore...
                </>
              ) : (
                <>
                  Confirm {selectedPlan === "free" ? "Free Plan" : "Premium Plan"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
