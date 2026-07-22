import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // 1. Stress Check-In AI Analysis Endpoint
  app.post("/api/ai/analyze-stress", async (req, res) => {
    try {
      const { score, moodTags, physicalSymptoms, contextNote } = req.body;
      const ai = getGeminiClient();

      const prompt = `Perform a compassionate, clinical stress check-in evaluation for a user.
Data input:
- Stress Score: ${score}/100
- Emotion/Mood Tags: ${Array.isArray(moodTags) ? moodTags.join(', ') : moodTags || 'None specified'}
- Physical Tension Indicators: ${Array.isArray(physicalSymptoms) ? physicalSymptoms.join(', ') : physicalSymptoms || 'None specified'}
- User Context Note: "${contextNote || 'No additional note provided'}"

Analyze the primary stress category, severity, cognitive distortions, a gentle CBT cognitive reframing, a structured 3-step immediate relief action plan, a recommended soundscape, a recommended breathing exercise, and an empowering quote.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert psychological stress management AI specializing in CBT, mindfulness, somatic grounding, and evidence-based stress reduction.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stressCategory: { type: Type.STRING, description: "Clear, empathetic category name (e.g. Cognitive Overload, Somatic Anxiety, Emotional Fatigue)" },
              severity: { type: Type.STRING, description: "One of: minimal, mild, moderate, high, severe" },
              primaryTriggers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key stress triggers extracted or inferred"
              },
              cognitiveReframing: {
                type: Type.OBJECT,
                properties: {
                  originalThought: { type: Type.STRING, description: "The stressful or catastrophic core thought" },
                  reframeStatement: { type: Type.STRING, description: "Empathetic, grounded alternative perspective statement" },
                  cbtPerspective: { type: Type.STRING, description: "Brief psychological insight into why this reframe helps" }
                },
                required: ["originalThought", "reframeStatement", "cbtPerspective"]
              },
              actionPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    duration: { type: Type.STRING, description: "e.g., '2 mins', '5 mins'" },
                    type: { type: Type.STRING, description: "One of: breathing, grounding, action, reflection" }
                  },
                  required: ["step", "title", "description", "duration", "type"]
                }
              },
              recommendedSoundscape: {
                type: Type.STRING,
                description: "Exact string match of one of: ocean_breeze, rain_meditation, deep_alpha_waves, calm_forest, gentle_brown_noise"
              },
              recommendedBreathingPattern: {
                type: Type.STRING,
                description: "Exact string match of one of: box_4_4, calm_4_7_8, sigh_2_1_4, focus_4_4_2_2"
              },
              encouragingQuote: { type: Type.STRING, description: "Uplifting, wise mindfulness or stoic quote" }
            },
            required: [
              "stressCategory", "severity", "primaryTriggers", "cognitiveReframing",
              "actionPlan", "recommendedSoundscape", "recommendedBreathingPattern", "encouragingQuote"
            ]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/ai/analyze-stress:", error);
      res.status(500).json({ error: "Failed to analyze stress data.", details: error.message });
    }
  });

  // 2. AI Stress Coach Chat Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, userContext } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `You are Serene AI, an empathetic, supportive, and evidence-based stress management coach.
Your approach combines Cognitive Behavioral Therapy (CBT), Mindfulness, Acceptance & Commitment Therapy (ACT), and Somatic Grounding.

Guidelines:
- Keep your tone warm, calming, non-judgmental, and practical.
- Provide actionable, bite-sized advice or reframing exercises rather than long dense paragraphs.
- Offer gentle follow-up prompt suggestions when helpful.
- If the user is overwhelmed, offer a quick 1-minute somatic or breathing tip.
- Always validate their feelings first before offering a shift in perspective.
- Note: You are an AI coach for daily stress, wellness, and resilience — not a medical doctor or crisis hot-line replacement.

Current User Context: ${userContext || 'No context specified'}`;

      const contents = (messages || []).map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: "Hello" }] }],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Error in /api/ai/chat:", error);
      res.status(500).json({ error: "Failed to process chat message.", details: error.message });
    }
  });

  // 3. Task Deconstruct / De-escalation Endpoint
  app.post("/api/ai/deconstruct-task", async (req, res) => {
    try {
      const { taskDescription } = req.body;
      const ai = getGeminiClient();

      const prompt = `Deconstruct this overwhelming task or project into 3 to 4 tiny, frictionless micro-steps that take 5 minutes or less to start:
Task Description: "${taskDescription}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a productivity & stress-reduction specialist who breaks down daunting projects to overcome executive dysfunction and task anxiety.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              originalTask: { type: Type.STRING },
              mindsetShift: { type: Type.STRING, description: "A reassuring 1-sentence shift in perspective to reduce pressure" },
              microSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    number: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    action: { type: Type.STRING, description: "Clear, concrete physical or digital action" },
                    estimatedMinutes: { type: Type.INTEGER }
                  },
                  required: ["number", "title", "action", "estimatedMinutes"]
                }
              }
            },
            required: ["originalTask", "mindsetShift", "microSteps"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error in /api/ai/deconstruct-task:", error);
      res.status(500).json({ error: "Failed to deconstruct task.", details: error.message });
    }
  });

  // 4. Journal Analysis Endpoint
  app.post("/api/ai/journal-analysis", async (req, res) => {
    try {
      const { journalText, moodRating } = req.body;
      const ai = getGeminiClient();

      const prompt = `Analyze this daily wellness journal entry. Mood Rating: ${moodRating}/5.
Entry: "${journalText}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an empathetic mindfulness journal analyzer.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentimentSummary: { type: Type.STRING, description: "Compassionate summary of the emotional tone" },
              detectedThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core themes e.g. Work-life balance, Gratitude, Time pressure" },
              resilienceTip: { type: Type.STRING, description: "A subtle, practical tip to nurture emotional resilience" },
              positiveHighlight: { type: Type.STRING, description: "A bright spot or strength identified in the entry" }
            },
            required: ["sentimentSummary", "detectedThemes", "resilienceTip", "positiveHighlight"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error in /api/ai/journal-analysis:", error);
      res.status(500).json({ error: "Failed to analyze journal.", details: error.message });
    }
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
