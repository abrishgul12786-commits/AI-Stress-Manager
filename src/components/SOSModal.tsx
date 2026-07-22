import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Heart, Eye, Hand, Ear, Sun, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundSynthesizer } from '../lib/soundSynthesizer';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [sighCount, setSighCount] = useState<number>(0);
  const [groundingInputs, setGroundingInputs] = useState({
    see: '',
    feel: '',
    hear: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSighCount(0);
      soundSynthesizer.playChime(396, 2.5); // Solfeggio 396Hz liberation frequency
    } else {
      soundSynthesizer.stopAll();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSighClick = () => {
    const next = sighCount + 1;
    setSighCount(next);
    soundSynthesizer.playChime(432, 2);
    if (next >= 3) {
      setTimeout(() => setStep(2), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-rose-950/30">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-200">SOS 60-Second Decompress</h3>
              <p className="text-xs text-slate-400">Immediate somatic grounding & pressure release</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-6 px-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center space-x-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? 'bg-teal-500 text-slate-950 ring-4 ring-teal-500/20'
                      : step > s
                      ? 'bg-slate-700 text-teal-300'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4 text-teal-400" /> : s}
                </div>
                <span className={`text-xs ${step === s ? 'text-teal-300 font-semibold' : 'text-slate-500'}`}>
                  {s === 1 ? 'Physiological Sigh' : s === 2 ? '5-4-3 Grounding' : 'Affirmation'}
                </span>
                {s < 3 && <div className="w-6 h-0.5 bg-slate-800" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Physiological Sigh */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-4 space-y-6"
              >
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-100">Take 3 Physiological Sighs</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Double inhale through your nose (one deep, then one extra burst), followed by a long, slow exhale through your mouth.
                  </p>
                </div>

                <div className="relative flex items-center justify-center my-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1.3, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-teal-500/20 to-rose-500/20 border-2 border-teal-400/40 flex items-center justify-center shadow-lg shadow-teal-500/10"
                  >
                    <Heart className="w-10 h-10 text-teal-300 animate-pulse" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-teal-400">
                    Sigh Completed: {sighCount} / 3
                  </p>
                  <button
                    onClick={handleSighClick}
                    className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-teal-500/25 active:scale-95 cursor-pointer"
                  >
                    {sighCount >= 3 ? 'Move to Grounding →' : `Complete Sigh ${sighCount + 1}`}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: 5-4-3 Grounding */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4 py-2"
              >
                <div className="text-center space-y-1">
                  <h4 className="text-base font-bold text-slate-100">Quick Sensory Anchor</h4>
                  <p className="text-xs text-slate-400">Anchor your mind in physical reality right now.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1.5">
                    <label className="flex items-center space-x-2 text-teal-300 font-semibold">
                      <Eye className="w-4 h-4 text-teal-400" />
                      <span>Name 1 thing you SEE right now:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. My desk, the blue lamp, the window..."
                      value={groundingInputs.see}
                      onChange={(e) => setGroundingInputs({ ...groundingInputs, see: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1.5">
                    <label className="flex items-center space-x-2 text-indigo-300 font-semibold">
                      <Hand className="w-4 h-4 text-indigo-400" />
                      <span>Name 1 physical texture you FEEL:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Feet flat on floor, cool air, cotton shirt..."
                      value={groundingInputs.feel}
                      onChange={(e) => setGroundingInputs({ ...groundingInputs, feel: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 space-y-1.5">
                    <label className="flex items-center space-x-2 text-amber-300 font-semibold">
                      <Ear className="w-4 h-4 text-amber-400" />
                      <span>Name 1 sound you HEAR:</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fan humming, gentle breeze, distant traffic..."
                      value={groundingInputs.hear}
                      onChange={(e) => setGroundingInputs({ ...groundingInputs, hear: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    Continue to Affirmation →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Affirmation & Completion */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-300 shadow-xl shadow-teal-500/10">
                  <Sparkles className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-3 px-4">
                  <h4 className="text-xl font-bold text-teal-200">You are safe in this present moment.</h4>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "This wave of tension is a physical signal, not a permanent reality. My nervous system is settling step by step."
                  </p>
                </div>

                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300 text-left space-y-1">
                  <div className="font-semibold text-teal-400 mb-1">Grounding Recap:</div>
                  <p>• Eyes focused on: {groundingInputs.see || 'Your surroundings'}</p>
                  <p>• Body anchored by: {groundingInputs.feel || 'Physical presence'}</p>
                  <p>• Ears tuned to: {groundingInputs.hear || 'Ambient background'}</p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-white font-bold text-sm transition shadow-lg cursor-pointer"
                >
                  I Feel Grounded Now (Return to App)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
