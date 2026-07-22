import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, CheckCircle2, Sparkles } from 'lucide-react';
import { BreathingPatternConfig, BreathingPatternId } from '../types';
import { soundSynthesizer } from '../lib/soundSynthesizer';

interface BreathingStudioProps {
  initialPatternId?: BreathingPatternId;
}

const BREATHING_PATTERNS: BreathingPatternConfig[] = [
  {
    id: 'box_4_4',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Used by Navy SEALs to lower heart rate and restore nervous system calm under acute pressure.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    id: 'calm_4_7_8',
    name: '4-7-8 Deep Calm',
    description: 'Triggers parasympathetic nerve dominance to quiet racing thoughts and prepare for restorative rest.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'sigh_2_1_4',
    name: 'Physiological Sigh',
    description: 'Double inhale expands collapsed alveoli in lungs, rapidly dumping CO2 to eliminate anxiety spikes.',
    inhale: 3,
    hold1: 1,
    exhale: 5,
    hold2: 0,
    color: 'from-rose-500 to-amber-500',
  },
  {
    id: 'focus_4_4_2_2',
    name: 'Tactical Focus (4-4-2-2)',
    description: 'Balances oxygen levels to boost mental clarity, sharp focus, and quiet brain fog.',
    inhale: 4,
    hold1: 4,
    exhale: 2,
    hold2: 2,
    color: 'from-cyan-500 to-blue-500',
  },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const BreathingStudio: React.FC<BreathingStudioProps> = ({ initialPatternId }) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPatternConfig>(
    BREATHING_PATTERNS.find((p) => p.id === initialPatternId) || BREATHING_PATTERNS[0]
  );
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [timeLeft, setTimeLeft] = useState<number>(selectedPattern.inhale);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [chimeEnabled, setChimeEnabled] = useState<boolean>(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialPatternId) {
      const match = BREATHING_PATTERNS.find((p) => p.id === initialPatternId);
      if (match) setSelectedPattern(match);
    }
  }, [initialPatternId]);

  // Reset exercise when pattern changes
  useEffect(() => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setCompletedCycles(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedPattern]);

  // Handle phase transitions
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'inhale') {
            if (selectedPattern.hold1 > 0) {
              setPhase('hold1');
              if (chimeEnabled) soundSynthesizer.playChime(528, 1.5);
              return selectedPattern.hold1;
            } else {
              setPhase('exhale');
              if (chimeEnabled) soundSynthesizer.playChime(396, 1.5);
              return selectedPattern.exhale;
            }
          } else if (phase === 'hold1') {
            setPhase('exhale');
            if (chimeEnabled) soundSynthesizer.playChime(396, 1.5);
            return selectedPattern.exhale;
          } else if (phase === 'exhale') {
            if (selectedPattern.hold2 > 0) {
              setPhase('hold2');
              if (chimeEnabled) soundSynthesizer.playChime(432, 1.5);
              return selectedPattern.hold2;
            } else {
              setPhase('inhale');
              setCompletedCycles((c) => c + 1);
              if (chimeEnabled) soundSynthesizer.playChime(528, 2);
              return selectedPattern.inhale;
            }
          } else {
            // hold2
            setPhase('inhale');
            setCompletedCycles((c) => c + 1);
            if (chimeEnabled) soundSynthesizer.playChime(528, 2);
            return selectedPattern.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, selectedPattern, chimeEnabled]);

  const togglePlay = () => {
    if (!isActive && chimeEnabled) {
      soundSynthesizer.playChime(528, 2);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setCompletedCycles(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale deeply through your nose...';
      case 'hold1':
        return 'Hold breath gently... stay still';
      case 'exhale':
        return 'Slow, smooth exhale through your mouth...';
      case 'hold2':
        return 'Pause & relax muscles before next breath...';
    }
  };

  const getOrbScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.45;
      case 'hold1':
        return 1.45;
      case 'exhale':
        return 0.85;
      case 'hold2':
        return 0.85;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Guided Somatic Breathing Studio</h2>
              <p className="text-xs text-slate-400">Paced visual breathing cycles for immediate autonomic nervous system downregulation.</p>
            </div>
          </div>

          <button
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`p-2.5 rounded-xl border transition flex items-center space-x-2 text-xs font-semibold cursor-pointer ${
              chimeEnabled
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            {chimeEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>{chimeEnabled ? 'Audio Chimes ON' : 'Chimes Muted'}</span>
          </button>
        </div>

        {/* Pattern Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {BREATHING_PATTERNS.map((pattern) => {
            const isSelected = selectedPattern.id === pattern.id;
            return (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-slate-800/90 border-teal-500/50 text-slate-100 shadow-md shadow-teal-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-200">{pattern.name}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-1">{pattern.description}</div>
                </div>
                <div className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">
                  {pattern.inhale}s In • {pattern.hold1}s Hold • {pattern.exhale}s Out {pattern.hold2 > 0 ? `• ${pattern.hold2}s Pause` : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Visual Orb Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl flex flex-col items-center justify-center space-y-8 min-h-[420px]">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/20 via-slate-900 to-indigo-950/20 pointer-events-none" />

        {/* Phase Guidance Text */}
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
            {phase === 'inhale' ? 'Inhale' : phase === 'hold1' ? 'Hold' : phase === 'exhale' ? 'Exhale' : 'Pause'}
          </span>
          <h3 className="text-2xl font-black text-slate-100 min-h-[36px]">
            {getPhaseInstruction()}
          </h3>
        </div>

        {/* Animated Breathing Orb */}
        <div className="relative z-10 my-4 flex items-center justify-center w-64 h-64">
          {/* Outer Ripple Rings */}
          <motion.div
            animate={{
              scale: isActive ? getOrbScale() : 1,
              opacity: isActive ? [0.2, 0.4, 0.2] : 0.2,
            }}
            transition={{
              duration: isActive
                ? phase === 'inhale'
                  ? selectedPattern.inhale
                  : phase === 'hold1'
                  ? selectedPattern.hold1
                  : phase === 'exhale'
                  ? selectedPattern.exhale
                  : selectedPattern.hold2
                : 2,
              ease: 'easeInOut',
            }}
            className={`absolute w-56 h-56 rounded-full bg-gradient-to-tr ${selectedPattern.color} opacity-20 blur-xl`}
          />

          {/* Core Orb */}
          <motion.div
            animate={{
              scale: isActive ? getOrbScale() : 1,
            }}
            transition={{
              duration: isActive
                ? phase === 'inhale'
                  ? selectedPattern.inhale
                  : phase === 'hold1'
                  ? selectedPattern.hold1
                  : phase === 'exhale'
                  ? selectedPattern.exhale
                  : selectedPattern.hold2
                : 2,
              ease: 'easeInOut',
            }}
            className={`w-44 h-44 rounded-full bg-gradient-to-tr ${selectedPattern.color} border-4 border-white/20 flex flex-col items-center justify-center text-white shadow-2xl shadow-teal-500/20`}
          >
            <span className="text-4xl font-black tracking-tight">{timeLeft}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">Seconds</span>
          </motion.div>
        </div>

        {/* Controls Bar */}
        <div className="relative z-10 flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="px-8 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-xl shadow-teal-500/25 flex items-center space-x-2 cursor-pointer active:scale-95"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Breathing</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats footer */}
        <div className="relative z-10 text-xs text-slate-400 flex items-center space-x-4 font-medium">
          <span>Cycles Completed: <strong className="text-teal-300">{completedCycles}</strong></span>
          <span>•</span>
          <span>Pattern: <strong className="text-slate-200">{selectedPattern.name}</strong></span>
        </div>
      </div>
    </div>
  );
};
