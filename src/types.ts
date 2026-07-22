export type StressLevel = 'minimal' | 'mild' | 'moderate' | 'high' | 'severe';

export interface StressCheckInInput {
  score: number; // 0 to 100
  moodTags: string[];
  physicalSymptoms: string[];
  contextNote: string;
  timestamp: string;
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  type: 'breathing' | 'grounding' | 'action' | 'reflection';
}

export interface CognitiveReframing {
  originalThought: string;
  reframeStatement: string;
  cbtPerspective: string;
}

export interface AIStressAnalysis {
  stressCategory: string;
  severity: StressLevel;
  primaryTriggers: string[];
  cognitiveReframing: CognitiveReframing;
  actionPlan: ActionStep[];
  recommendedSoundscape: 'ocean_breeze' | 'rain_meditation' | 'deep_alpha_waves' | 'calm_forest' | 'gentle_brown_noise';
  recommendedBreathingPattern: 'box_4_4' | 'calm_4_7_8' | 'sigh_2_1_4' | 'focus_4_4_2_2';
  encouragingQuote: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  reframing?: CognitiveReframing;
}

export interface DeconstructedTask {
  originalTask: string;
  mindsetShift: string;
  microSteps: {
    number: number;
    title: string;
    action: string;
    estimatedMinutes: number;
  }[];
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  moodRating: number; // 1-5
  aiInsight?: {
    sentimentSummary: string;
    detectedThemes: string[];
    resilienceTip: string;
    positiveHighlight: string;
  };
}

export interface StressHistoryLog {
  id: string;
  date: string;
  score: number;
  category: string;
  tags: string[];
  note: string;
}

export type SoundPreset = 'ocean_breeze' | 'rain_meditation' | 'deep_alpha_waves' | 'calm_forest' | 'gentle_brown_noise';

export type BreathingPatternId = 'box_4_4' | 'calm_4_7_8' | 'sigh_2_1_4' | 'focus_4_4_2_2';

export interface BreathingPatternConfig {
  id: BreathingPatternId;
  name: string;
  description: string;
  inhale: number; // seconds
  hold1: number;
  exhale: number;
  hold2: number;
  color: string;
}
