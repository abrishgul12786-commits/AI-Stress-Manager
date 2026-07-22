import React from 'react';
import { Activity, Sparkles, Wind, Music, MessageSquareHeart, Layers, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AIStressAnalysis, StressCheckInInput, SoundPreset, BreathingPatternId } from '../types';

interface DashboardOverviewProps {
  latestCheckIn?: StressCheckInInput | null;
  latestAnalysis?: AIStressAnalysis | null;
  streakCount: number;
  onNavigateTab: (tab: string) => void;
  onNavigateToBreathing: (pattern?: BreathingPatternId) => void;
  onNavigateToSoundscape: (soundscape?: SoundPreset) => void;
  onOpenSOS: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  latestCheckIn,
  latestAnalysis,
  streakCount,
  onNavigateTab,
  onNavigateToBreathing,
  onNavigateToSoundscape,
  onOpenSOS,
}) => {
  const currentScore = latestCheckIn?.score ?? 45;

  const getScoreBadge = (val: number) => {
    if (val < 30) return { label: 'Optimal / Peaceful', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (val < 60) return { label: 'Moderate Pressure', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    if (val < 80) return { label: 'High Tension', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
    return { label: 'Acute Stress / High Overload', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const badge = getScoreBadge(currentScore);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Your Calm Space</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Nurture peace, reframe stress, and restore your calm.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Aura Calm brings together real-time physiological check-ins, CBT cognitive reframing, synthesized acoustic soundscapes, and guided somatic breathing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-teal-500/20 flex items-center space-x-2 cursor-pointer"
            >
              <span>Take Stress Check-In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSOS}
              className="px-5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-900/30 flex items-center space-x-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS 60s Decompress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stress Meter Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Current Stress Meter</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-slate-100">{currentScore}</span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>

            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
              {badge.label}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {latestCheckIn ? `Last logged: ${new Date(latestCheckIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No recent check-in today.'}
          </p>
        </div>

        {/* Calm Streak Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Calm & Mindfulness Streak</span>
            <span className="text-xl">🔥</span>
          </div>

          <div className="space-y-1">
            <span className="text-4xl font-black text-amber-300">{streakCount} Days</span>
            <p className="text-xs text-slate-400">Consistent daily mindfulness downregulates stress reactivity over time.</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-teal-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
            <span>Active check-in recorded for today!</span>
          </div>
        </div>

        {/* Recommended Relief Action */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2">Recommended Relief Tool</div>
            <h4 className="text-base font-bold text-slate-100">
              {latestAnalysis?.recommendedBreathingPattern
                ? `Breathing: ${latestAnalysis.recommendedBreathingPattern.replace(/_/g, ' ')}`
                : 'Box Breathing (4-4-4-4)'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Reset your vagus nerve with a quick 2-minute visual breathing cycle.
            </p>
          </div>

          <button
            onClick={() => onNavigateToBreathing(latestAnalysis?.recommendedBreathingPattern)}
            className="w-full py-2.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Wind className="w-4 h-4" />
            <span>Launch Breathing Studio</span>
          </button>
        </div>
      </div>

      {/* Quick Access Tool Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200">Instant Stress Management Tools</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tool 1 */}
          <div
            onClick={() => onNavigateTab('checkin')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl transition cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">AI Stress Check-In</h4>
              <p className="text-xs text-slate-400 mt-1">Log score & get CBT cognitive reframing.</p>
            </div>
          </div>

          {/* Tool 2 */}
          <div
            onClick={() => onNavigateTab('coach')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-950 transition">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">AI CBT Coach</h4>
              <p className="text-xs text-slate-400 mt-1">Chat through anxiety with Serene AI.</p>
            </div>
          </div>

          {/* Tool 3 */}
          <div
            onClick={() => onNavigateTab('soundscape')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Soundscapes</h4>
              <p className="text-xs text-slate-400 mt-1">Ocean, rain, and 10Hz binaural waves.</p>
            </div>
          </div>

          {/* Tool 4 */}
          <div
            onClick={() => onNavigateTab('deconstruct')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition cursor-pointer space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Task Deconstruct</h4>
              <p className="text-xs text-slate-400 mt-1">Break big projects into 5-min micro-steps.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-2">
        <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block">Daily Stoic & Mindfulness Perspective</span>
        <p className="text-sm text-slate-200 italic max-w-xl mx-auto">
          "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom."
        </p>
        <span className="text-xs text-slate-500 block">— Viktor E. Frankl</span>
      </div>
    </div>
  );
};
