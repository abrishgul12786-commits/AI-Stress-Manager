import React from 'react';
import { Activity, MessageSquareHeart, Wind, Music, BookOpen, Layers, AlertCircle, Sparkles, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  onOpenSOS: () => void;
  latestScore?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakCount,
  onOpenSOS,
  latestScore
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'checkin', label: 'Stress Check-In', icon: Sparkles },
    { id: 'coach', label: 'AI CBT Coach', icon: MessageSquareHeart },
    { id: 'breathing', label: 'Breathing Studio', icon: Wind },
    { id: 'soundscape', label: 'Soundscapes', icon: Music },
    { id: 'journal', label: 'AI Journal', icon: BookOpen },
    { id: 'deconstruct', label: 'Task Deconstruct', icon: Layers },
  ];

  const getScoreColor = (score?: number) => {
    if (score === undefined) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (score < 30) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (score < 60) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (score < 80) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Wind className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-teal-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Aura CalmA
              </span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider -mt-1 font-medium">
                AI Stress Companion
              </span>
            </div>
          </div>

          {/* Quick Status Badges & Emergency SOS */}
          <div className="flex items-center space-x-3">
            {latestScore !== undefined && (
              <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getScoreColor(latestScore)}`}>
                <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                <span>Stress: {latestScore}/100</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 text-xs text-amber-300 font-medium">
              <span>🔥</span>
              <span>{streakCount} Day Streak</span>
            </div>

            <button
              onClick={onOpenSOS}
              id="sos-button"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition shadow-md shadow-rose-900/30 cursor-pointer active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>SOS 60s Decompress</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
