import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Wind, Music, AlertTriangle, ArrowRight, Lightbulb, CheckCircle, RefreshCw } from 'lucide-react';
import { AIStressAnalysis, StressCheckInInput, SoundPreset, BreathingPatternId } from '../types';

interface StressCheckInProps {
  onAnalysisComplete: (analysis: AIStressAnalysis, checkIn: StressCheckInInput) => void;
  onNavigateToBreathing: (pattern?: BreathingPatternId) => void;
  onNavigateToSoundscape: (soundscape?: SoundPreset) => void;
}

const COMMON_MOOD_TAGS = [
  'Overwhelmed', 'Anxious', 'Exhausted', 'Frustrated', 'Brain Fog',
  'Restless', 'Irritable', 'Tense', 'Calm', 'Hopeful'
];

const PHYSICAL_SYMPTOMS = [
  'Clenched Jaw', 'Tight Shoulders', 'Shallow Breathing', 'Racing Heart',
  'Head Tension', 'Stiff Neck', 'Stomach Knot', 'Eye Fatigue'
];

export const StressCheckIn: React.FC<StressCheckInProps> = ({
  onAnalysisComplete,
  onNavigateToBreathing,
  onNavigateToSoundscape,
}) => {
  const [score, setScore] = useState<number>(55);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['Overwhelmed', 'Tense']);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Tight Shoulders']);
  const [contextNote, setContextNote] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIStressAnalysis | null>(null);

  const toggleTag = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, tag: string) => {
    if (list.includes(tag)) {
      setList(list.filter((t) => t !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const getGaugeColor = (val: number) => {
    if (val < 30) return { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30' };
    if (val < 60) return { text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/30' };
    if (val < 80) return { text: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500/30' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/30' };
  };

  const gaugeStyle = getGaugeColor(score);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const checkInData: StressCheckInInput = {
      score,
      moodTags: selectedMoods,
      physicalSymptoms: selectedSymptoms,
      contextNote,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/ai/analyze-stress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkInData),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: AIStressAnalysis = await response.json();
      setAnalysisResult(data);
      onAnalysisComplete(data, checkInData);
    } catch (err) {
      console.error('Failed to analyze stress:', err);
      // Fallback response if offline/error
      const fallback: AIStressAnalysis = {
        stressCategory: 'Acute Work Pressure',
        severity: score > 70 ? 'high' : 'moderate',
        primaryTriggers: ['Task accumulation', 'Physical muscle tension'],
        cognitiveReframing: {
          originalThought: "I can't possibly finish all of this and I am falling behind.",
          reframeStatement: "I don't need to tackle everything right now. Focusing on one single 5-minute task brings me clarity.",
          cbtPerspective: "De-catastrophizing breaks the anxiety loop by returning focus to the immediate present."
        },
        actionPlan: [
          { step: 1, title: '2-Minute Box Breathing', description: 'Reset your autonomic nervous system with equal 4-second breath intervals.', duration: '2 mins', type: 'breathing' },
          { step: 2, title: 'Physical Shoulder Drop', description: 'Inhale deeply, roll shoulders backward, and release all tension on exhale.', duration: '1 min', type: 'grounding' },
          { step: 3, title: 'Single Focus Action', description: 'Pick the smallest 5-minute task and ignore all secondary items for now.', duration: '5 mins', type: 'action' },
        ],
        recommendedSoundscape: 'ocean_breeze',
        recommendedBreathingPattern: 'box_4_4',
        encouragingQuote: "You don't have to control the whole storm. You just have to ground yourself in this single moment."
      };
      setAnalysisResult(fallback);
      onAnalysisComplete(fallback, checkInData);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title & Introduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">AI Stress Check-In & Diagnostics</h2>
            <p className="text-xs text-slate-400">Log your present physiological state for instant CBT cognitive reframing & relief protocols.</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-8 space-y-8">
          {/* Slider Gauge */}
          <div className="space-y-4 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">Current Stress Intensity Level</label>
              <span className={`text-2xl font-black ${gaugeStyle.text}`}>
                {score} / 100
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>0 (Peaceful / Calm)</span>
              <span>30 (Mild Pressure)</span>
              <span>60 (Moderate Tension)</span>
              <span>80+ (High / Overwhelmed)</span>
            </div>
          </div>

          {/* Mood & Emotional Tags */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Emotional State & Feelings
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_MOOD_TAGS.map((tag) => {
                const isSelected = selectedMoods.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(selectedMoods, setSelectedMoods, tag)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Physical Tension Map */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Physical Tension Indicators
            </label>
            <div className="flex flex-wrap gap-2">
              {PHYSICAL_SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleTag(selectedSymptoms, setSelectedSymptoms, symptom)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Situation Context Note */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Situation Context / What's on your mind? (Optional)
            </label>
            <textarea
              rows={3}
              value={contextNote}
              onChange={(e) => setContextNote(e.target.value)}
              placeholder="e.g., Too many emails piling up, feeling anxious about tomorrow's team review..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-teal-500/60 placeholder-slate-600 resize-none"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI Analyzing Biometrics & Cognitive Triggers...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Generate AI Stress Analysis & Relief Protocol</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Analysis Results Output */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
        >
          {/* Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                  Category: {analysisResult.stressCategory}
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase">
                  Severity: {analysisResult.severity}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-2">AI Relief Diagnosis & Plan</h3>
            </div>

            {/* Quick Action Launchers */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigateToBreathing(analysisResult.recommendedBreathingPattern)}
                className="px-4 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Wind className="w-4 h-4" />
                <span>Start Breathing ({analysisResult.recommendedBreathingPattern.replace(/_/g, ' ')})</span>
              </button>

              <button
                onClick={() => onNavigateToSoundscape(analysisResult.recommendedSoundscape)}
                className="px-4 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Music className="w-4 h-4" />
                <span>Play Soundscape</span>
              </button>
            </div>
          </div>

          {/* CBT Cognitive Reframing Card */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-indigo-500/20 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
              <Lightbulb className="w-5 h-5" />
              <span>Cognitive Behavioral Reframe (CBT)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Unhelpful / Catastrophic Thought</span>
                <p className="text-slate-300 italic">"{analysisResult.cognitiveReframing.originalThought}"</p>
              </div>

              <div className="p-4 bg-teal-950/40 rounded-xl border border-teal-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Grounded Reframed Perspective</span>
                <p className="text-teal-200 font-medium">"{analysisResult.cognitiveReframing.reframeStatement}"</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              💡 <span className="font-semibold text-slate-300">Why this helps:</span> {analysisResult.cognitiveReframing.cbtPerspective}
            </p>
          </div>

          {/* Action Plan Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200">Structured 3-Step Action Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisResult.actionPlan.map((step) => (
                <div key={step.step} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {step.duration}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-100">{step.title}</h5>
                  <p className="text-xs text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Banner */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
            <p className="text-xs text-slate-300 italic">"{analysisResult.encouragingQuote}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
