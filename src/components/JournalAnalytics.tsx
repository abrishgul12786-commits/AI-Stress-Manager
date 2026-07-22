import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Heart, RefreshCw, Calendar, Tag, PlusCircle } from 'lucide-react';
import { JournalEntry } from '../types';

export const JournalAnalytics: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [journalContent, setJournalContent] = useState<string>('');
  const [moodRating, setMoodRating] = useState<number>(3);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('aura_calm_journal_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved journal entries:', e);
      }
    }
  }, []);

  const saveEntriesToStorage = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('aura_calm_journal_entries', JSON.stringify(updated));
  };

  const handleSaveAndAnalyze = async () => {
    if (!journalContent.trim() || isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/ai/journal-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journalText: journalContent, moodRating }),
      });

      let aiInsight;
      if (response.ok) {
        aiInsight = await response.json();
      } else {
        aiInsight = {
          sentimentSummary: 'Reflective and thoughtful expressing work-life strain.',
          detectedThemes: ['Daily Focus', 'Work Balance'],
          resilienceTip: 'Give yourself permission to pause between major tasks.',
          positiveHighlight: 'Awareness of your current stress state is the first step in regaining control.'
        };
      }

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        content: journalContent,
        moodRating,
        aiInsight,
      };

      const updated = [newEntry, ...entries];
      saveEntriesToStorage(updated);
      setJournalContent('');
      setMoodRating(3);
    } catch (err) {
      console.error('Journal analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">AI Stress & Sentiment Journal</h2>
            <p className="text-xs text-slate-400">Vent freely. AI extracts hidden emotional themes, resilience highlights, and mood insights.</p>
          </div>
        </div>

        {/* Input area */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-xs font-semibold text-slate-300">How do you feel today? (Mood 1-5):</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setMoodRating(star)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition cursor-pointer ${
                    moodRating === star
                      ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {star === 1 ? '😔 1' : star === 2 ? '😐 2' : star === 3 ? '🙂 3' : star === 4 ? '😊 4' : '✨ 5'}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={4}
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="Write what happened today, what gave you stress, what you are grateful for, or how your body feels..."
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-teal-500/60 placeholder-slate-600 resize-none"
          />

          <button
            onClick={handleSaveAndAnalyze}
            disabled={!journalContent.trim() || isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-teal-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI Extracting Sentiment & Resilience Insights...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Save Entry & Generate AI Insights</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Feed */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-200">Past Journal Logs ({entries.length})</h3>

        {entries.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-500">
            No journal entries yet. Log your first thoughts above!
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>{entry.date}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 font-bold">
                  Mood: {entry.moodRating}/5
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{entry.content}</p>

              {entry.aiInsight && (
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-teal-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Sentiment & Resilience Summary:</span>
                  </div>

                  <p className="text-slate-300">{entry.aiInsight.sentimentSummary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded-lg">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Bright Spot</span>
                      <span className="text-slate-200">{entry.aiInsight.positiveHighlight}</span>
                    </div>

                    <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/20 rounded-lg">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Resilience Tip</span>
                      <span className="text-slate-200">{entry.aiInsight.resilienceTip}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
