# Aura Calm — AI Stress Manager Companion

Aura Calm is an intelligent, evidence-based stress management application designed to help users identify, manage, and reduce stress in real time. Powered by Google Gemini AI and built with React, Express, Tailwind CSS, and Web Audio API, the app combines Cognitive Behavioral Therapy (CBT) principles, somatic grounding, synthesized acoustic soundscapes, and guided breathing exercises.

---

## 🌟 Key Features

1. **AI Stress Check-In & Diagnostics**
   - Interactive 0–100 stress intensity gauge with customizable emotional tags and physical tension mapping.
   - Server-side Gemini AI analysis providing stress categorization, CBT cognitive reframing, and structured 3-step immediate relief action plans.

2. **SOS 60-Second Decompress**
   - Quick-access emergency grounding protocol launching a 3-step somatic exercise: Physiological Sighs, 5-4-3 Sensory Anchoring, and reassuring affirmations.

3. **Serene — AI CBT Stress Coach**
   - Interactive, empathetic chat coach combining CBT, Mindfulness, and Acceptance & Commitment Therapy (ACT) to talk through anxiety and reframe unhelpful thoughts.

4. **Guided Somatic Breathing Studio**
   - Visual breathing orb supporting multiple evidence-based breathing patterns:
     - **Box Breathing (4-4-4-4)**: Restores calm under acute pressure.
     - **4-7-8 Deep Calm**: Triggers parasympathetic nerve dominance.
     - **Physiological Sigh**: Rapidly dumps CO2 to lower heart rate.
     - **Tactical Focus (4-4-2-2)**: Clears brain fog and boosts focus.
   - Harmonic audio chimes generated via Web Audio API.

5. **Synthesized Relaxation Soundscapes**
   - Real-time acoustic sound generator using the Web Audio API:
     - **Ocean Waves** (LFO-modulated swell)
     - **Gentle Rain** (Filtered pink noise)
     - **Deep Alpha Waves** (10Hz binaural frequency entrainment)
     - **Calm Forest Breeze** (Bandpass swaying wind)
     - **Warm Brown Noise** (Deep acoustic masking)
   - Master volume control and auto-off sleep timers (10m, 20m, 30m).

6. **AI Task De-escalation & Micro-Steps**
   - Deconstructs daunting projects into 5-minute micro-actions with mindset shifts to overcome procrastination and executive dysfunction.

7. **AI Stress & Sentiment Journal**
   - Daily reflection journal where Gemini AI extracts emotional sentiment summaries, detected themes, bright spots, and resilience tips.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons
- **Backend**: Express v4, Node.js, `tsx`, `esbuild`
- **AI Integration**: `@google/genai` TypeScript SDK (Gemini 3.6 Flash)
- **Audio Engine**: Web Audio API (procedural noise generation, LFO modulation, binaural beats, and chime synthesizers)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Gemini API Key (configured via environment variable `GEMINI_API_KEY`)

### Installation & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**:
   Copy or configure `.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```
   Launches the full-stack server on `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Endpoints

- `POST /api/ai/analyze-stress` — Evaluates stress metrics and returns CBT reframes and structured action plans.
- `POST /api/ai/chat` — Conversational CBT coaching session with Serene AI.
- `POST /api/ai/deconstruct-task` — Breaks down complex tasks into 5-minute micro-steps.
- `POST /api/ai/journal-analysis` — Analyzes daily journal entries for sentiment and resilience insights.
