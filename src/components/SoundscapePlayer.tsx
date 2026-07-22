import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Timer, Sparkles, Sliders } from 'lucide-react';
import { SoundPreset } from '../types';
import { soundSynthesizer } from '../lib/soundSynthesizer';

interface SoundscapePlayerProps {
  initialSoundscape?: SoundPreset;
}

interface SoundPresetConfig {
  id: SoundPreset;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  startFn: () => void;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ initialSoundscape }) => {
  const [activeSound, setActiveSound] = useState<SoundPreset | null>(initialSoundscape || null);
  const [volume, setVolume] = useState<number>(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  const SOUND_PRESETS: SoundPresetConfig[] = [
    {
      id: 'ocean_breeze',
      title: 'Ocean Waves',
      subtitle: 'Rhythmic Tide & Sea Breeze',
      description: 'LFO-modulated acoustic sea waves that sync naturally with peaceful respiratory rhythm.',
      icon: '🌊',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300',
      startFn: () => soundSynthesizer.startOceanBreeze('ocean_breeze'),
    },
    {
      id: 'rain_meditation',
      title: 'Gentle Rain',
      subtitle: 'Soft Rainfall & Earthy Resonance',
      description: 'Organic filtered pink noise simulating a soothing rain shower on forest leaves.',
      icon: '🌧️',
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-300',
      startFn: () => soundSynthesizer.startRainMeditation('rain_meditation'),
    },
    {
      id: 'deep_alpha_waves',
      title: 'Deep Alpha Waves (10Hz)',
      subtitle: 'Binaural Frequency Entrainment',
      description: 'Dual sine harmonics generating 10Hz alpha difference frequency for stress reduction.',
      icon: '🧠',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300',
      startFn: () => soundSynthesizer.startDeepAlphaWaves('deep_alpha_waves'),
    },
    {
      id: 'calm_forest',
      title: 'Calm Forest Breeze',
      subtitle: 'Swaying Wind & Canopy Resonance',
      description: 'Bandpass filtered acoustic breeze for refreshing clarity and grounding.',
      icon: '🌲',
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300',
      startFn: () => soundSynthesizer.startCalmForest('calm_forest'),
    },
    {
      id: 'gentle_brown_noise',
      title: 'Warm Brown Noise',
      subtitle: 'Deep Acoustic Masking',
      description: '6dB/octave filtered deep brown noise that shields mind from intrusive environmental sounds.',
      icon: '☕',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
      startFn: () => soundSynthesizer.startGentleBrownNoise('gentle_brown_noise'),
    },
  ];

  useEffect(() => {
    if (initialSoundscape) {
      handleSelectSound(initialSoundscape);
    }
    return () => {
      soundSynthesizer.stopAll();
    };
  }, [initialSoundscape]);

  useEffect(() => {
    soundSynthesizer.setMasterVolume(volume);
  }, [volume]);

  // Handle timer countdown
  useEffect(() => {
    if (timerRemaining === null || timerRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          soundSynthesizer.stopAll();
          setActiveSound(null);
          setTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRemaining]);

  const handleSelectSound = (id: SoundPreset) => {
    if (activeSound === id) {
      soundSynthesizer.stopAll();
      setActiveSound(null);
    } else {
      soundSynthesizer.stopAll();
      const preset = SOUND_PRESETS.find((p) => p.id === id);
      if (preset) {
        preset.startFn();
        setActiveSound(id);
      }
    }
  };

  const handleSetTimer = (mins: number) => {
    if (timerMinutes === mins) {
      setTimerMinutes(null);
      setTimerRemaining(null);
    } else {
      setTimerMinutes(mins);
      setTimerRemaining(mins * 60);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Synthesized Relaxation Soundscapes</h2>
              <p className="text-xs text-slate-400">Real-time Web Audio acoustic synthesis for sensory shielding & focus.</p>
            </div>
          </div>

          {activeSound && (
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Playing: {SOUND_PRESETS.find((p) => p.id === activeSound)?.title}</span>
            </div>
          )}
        </div>

        {/* Master Controls & Timer Bar */}
        <div className="mt-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Master Volume Slider */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <span className="text-xs text-slate-400 font-medium w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* Sleep Timer */}
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">Auto Off:</span>
            {[10, 20, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleSetTimer(mins)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timerMinutes === mins
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mins}m
              </button>
            ))}

            {timerRemaining !== null && (
              <span className="text-xs font-bold text-amber-400 ml-2">
                ⏱️ {formatTimer(timerRemaining)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sound Preset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SOUND_PRESETS.map((preset) => {
          const isPlaying = activeSound === preset.id;
          return (
            <div
              key={preset.id}
              className={`p-6 rounded-2xl border transition shadow-lg relative overflow-hidden flex flex-col justify-between space-y-4 ${
                isPlaying
                  ? 'bg-slate-800/90 border-teal-500/60 shadow-teal-500/10'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                    {preset.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{preset.title}</h3>
                    <p className="text-xs font-medium text-slate-400">{preset.subtitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectSound(preset.id)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer active:scale-95 ${
                    isPlaying
                      ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/25'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>

              {isPlaying && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-300 font-medium">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                    <span>Live Web Audio Synthesis Active</span>
                  </span>
                  <button
                    onClick={() => handleSelectSound(preset.id)}
                    className="text-rose-400 hover:underline font-semibold"
                  >
                    Stop Sound
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
