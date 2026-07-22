import React, { useState } from 'react';
import { Layers, Sparkles, CheckCircle2, Circle, ArrowRight, Lightbulb, RefreshCw } from 'lucide-react';
import { DeconstructedTask } from '../types';

export const TaskDeconstructModal: React.FC = () => {
  const [taskInput, setTaskInput] = useState<string>('');
  const [isDeconstructing, setIsDeconstructing] = useState<boolean>(false);
  const [deconstructed, setDeconstructed] = useState<DeconstructedTask | null>(null);
  const [completedStepNumbers, setCompletedStepNumbers] = useState<number[]>([]);

  const handleDeconstruct = async () => {
    if (!taskInput.trim() || isDeconstructing) return;
    setIsDeconstructing(true);
    setCompletedStepNumbers([]);

    try {
      const response = await fetch('/api/ai/deconstruct-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskDescription: taskInput }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: DeconstructedTask = await response.json();
      setDeconstructed(data);
    } catch (err) {
      console.error('Failed to deconstruct task:', err);
      // Fallback
      setDeconstructed({
        originalTask: taskInput,
        mindsetShift: "You don't have to finish everything right now. Completing just the first 3-minute step reduces friction by 80%.",
        microSteps: [
          { number: 1, title: 'Open Workspace & Clear Screen', action: 'Close unnecessary browser tabs and open a blank document or editor.', estimatedMinutes: 2 },
          { number: 2, title: 'Outline 3 Bullet Points', action: 'Write down 3 simple high-level headers without worrying about full sentences.', estimatedMinutes: 3 },
          { number: 3, title: 'Draft First Paragraph', action: 'Set a 5-minute timer and draft raw text without editing.', estimatedMinutes: 5 },
        ]
      });
    } finally {
      setIsDeconstructing(false);
    }
  };

  const toggleStep = (num: number) => {
    if (completedStepNumbers.includes(num)) {
      setCompletedStepNumbers(completedStepNumbers.filter((n) => n !== num));
    } else {
      setCompletedStepNumbers([...completedStepNumbers, num]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">AI Task De-escalation & Micro-Steps</h2>
            <p className="text-xs text-slate-400">Break daunting tasks into 5-minute friction-free micro-actions to cure procrastination paralysis.</p>
          </div>
        </div>

        {/* Input */}
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              What task or project is stressing you out?
            </label>
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Preparing the Q3 board deck, writing my research report, organizing taxes..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500/60 placeholder-slate-600"
            />
          </div>

          <button
            onClick={handleDeconstruct}
            disabled={!taskInput.trim() || isDeconstructing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isDeconstructing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>AI Deconstructing Task into Micro-Steps...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Deconstruct into 5-Minute Steps</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output */}
      {deconstructed && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Mindset Card */}
          <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
              <Lightbulb className="w-4 h-4" />
              <span>Mindset Shift</span>
            </div>
            <p className="text-xs text-slate-200 italic">"{deconstructed.mindsetShift}"</p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-200">Micro-Action Steps (5 Mins or Less)</h4>

            <div className="space-y-3">
              {deconstructed.microSteps.map((step) => {
                const isCompleted = completedStepNumbers.includes(step.number);
                return (
                  <div
                    key={step.number}
                    onClick={() => toggleStep(step.number)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-start space-x-4 ${
                      isCompleted
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-950 border border-slate-800 hover:border-teal-500/40'
                    }`}
                  >
                    <div className="mt-0.5 text-teal-400">
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-teal-400" /> : <Circle className="w-5 h-5 text-slate-600" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          ~{step.estimatedMinutes} mins
                        </span>
                      </div>
                      <p className={`text-xs ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                        {step.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
