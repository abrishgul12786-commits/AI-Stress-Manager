/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SOSModal } from './components/SOSModal';
import { DashboardOverview } from './components/DashboardOverview';
import { StressCheckIn } from './components/StressCheckIn';
import { BreathingStudio } from './components/BreathingStudio';
import { SoundscapePlayer } from './components/SoundscapePlayer';
import { AICoachChat } from './components/AICoachChat';
import { TaskDeconstructModal } from './components/TaskDeconstructModal';
import { JournalAnalytics } from './components/JournalAnalytics';
import { AIStressAnalysis, StressCheckInInput, SoundPreset, BreathingPatternId } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(4);

  const [latestCheckIn, setLatestCheckIn] = useState<StressCheckInInput | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<AIStressAnalysis | null>(null);

  const [breathingPattern, setBreathingPattern] = useState<BreathingPatternId | undefined>();
  const [soundscapePreset, setSoundscapePreset] = useState<SoundPreset | undefined>();

  useEffect(() => {
    // Load persisted state if exists
    const savedCheckIn = localStorage.getItem('aura_calm_latest_checkin');
    const savedAnalysis = localStorage.getItem('aura_calm_latest_analysis');
    if (savedCheckIn) {
      try {
        setLatestCheckIn(JSON.parse(savedCheckIn));
      } catch (e) {
        console.error('Error loading checkin state:', e);
      }
    }
    if (savedAnalysis) {
      try {
        setLatestAnalysis(JSON.parse(savedAnalysis));
      } catch (e) {
        console.error('Error loading analysis state:', e);
      }
    }
  }, []);

  const handleAnalysisComplete = (analysis: AIStressAnalysis, checkIn: StressCheckInInput) => {
    setLatestAnalysis(analysis);
    setLatestCheckIn(checkIn);
    localStorage.setItem('aura_calm_latest_checkin', JSON.stringify(checkIn));
    localStorage.setItem('aura_calm_latest_analysis', JSON.stringify(analysis));
  };

  const handleNavigateToBreathing = (pattern?: BreathingPatternId) => {
    if (pattern) setBreathingPattern(pattern);
    setActiveTab('breathing');
  };

  const handleNavigateToSoundscape = (soundscape?: SoundPreset) => {
    if (soundscape) setSoundscapePreset(soundscape);
    setActiveTab('soundscape');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950 flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakCount}
        onOpenSOS={() => setIsSOSOpen(true)}
        latestScore={latestCheckIn?.score}
      />

      {/* Main Body Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            latestCheckIn={latestCheckIn}
            latestAnalysis={latestAnalysis}
            streakCount={streakCount}
            onNavigateTab={setActiveTab}
            onNavigateToBreathing={handleNavigateToBreathing}
            onNavigateToSoundscape={handleNavigateToSoundscape}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'checkin' && (
          <StressCheckIn
            onAnalysisComplete={handleAnalysisComplete}
            onNavigateToBreathing={handleNavigateToBreathing}
            onNavigateToSoundscape={handleNavigateToSoundscape}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachChat
            userContext={latestAnalysis ? `Stress level: ${latestCheckIn?.score}/100. Category: ${latestAnalysis.stressCategory}` : undefined}
          />
        )}

        {activeTab === 'breathing' && (
          <BreathingStudio initialPatternId={breathingPattern} />
        )}

        {activeTab === 'soundscape' && (
          <SoundscapePlayer initialSoundscape={soundscapePreset} />
        )}

        {activeTab === 'journal' && (
          <JournalAnalytics />
        )}

        {activeTab === 'deconstruct' && (
          <TaskDeconstructModal />
        )}
      </main>

      {/* SOS Emergency Grounding Modal Overlay */}
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Aura Calm — Intelligent AI Stress Management Companion</p>
      </footer>
    </div>
  );
}
