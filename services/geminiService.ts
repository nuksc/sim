
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { PatientCase, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Audio Helper Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const generatePatientResponse = async (
  currentCase: PatientCase,
  history: ChatMessage[],
  userInput: string
) => {
  const systemInstruction = `
    You are an actor playing a patient for a nursing simulation.
    Patient Profile:
    - Name: ${currentCase.profile.name}
    - Age: ${currentCase.profile.age}
    - Gender: ${currentCase.profile.gender}
    - Chief Complaint: ${currentCase.profile.chiefComplaint}
    - Background: ${currentCase.profile.detailedBackground}
    - Personality: ${currentCase.profile.personality}

    Instruction:
    - Respond in Thai.
    - Stay in character.
    - Be concise.
    - Use the provided info for history taking.
    
    Expected Information for Nursing Assessment:
    ${currentCase.criteria.map(c => `- ${c.label}: ${c.expectedResponse}`).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text;
};

export const generateTTS = async (text: string, voiceName: string = 'Kore'): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        resolve(false);
        return;
      }

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        audioCtx.close();
        resolve(true);
      };

      source.start();
    } catch (error) {
      console.error("TTS Error:", error);
      resolve(false);
    }
  });
};

export const generatePatientAvatar = async (profile: string) => {
  try {
    const prompt = `A realistic high-quality portrait of a hospital patient. ${profile}. Plain hospital gown, medical setting background.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Avatar Gen Error:", error);
  }
  return `https://picsum.photos/seed/${Math.random()}/400/400`;
};

export const evaluateSession = async (
  currentCase: PatientCase, 
  history: ChatMessage[],
  diagnosisData: { diagnosis: string, rationale: string }
) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      { 
        role: 'user', 
        parts: [{ text: `
          Review this nursing session.
          Case Title: ${currentCase.title}
          Criteria to cover: ${JSON.stringify(currentCase.criteria)}
          Expected Diagnosis: ${currentCase.expectedDiagnosis}
          Expected Rationale: ${currentCase.diagnosisRationale}
          
          Student's Work:
          - History History: ${JSON.stringify(history)}
          - Student's Diagnosis: ${diagnosisData.diagnosis}
          - Student's Rationale: ${diagnosisData.rationale}

          Tasks:
          1. Evaluate history taking completeness (which criteria IDs were met).
          2. Evaluate diagnosis accuracy (0-100 score).
          3. Provide feedback in Thai focusing on clinical reasoning.
          Return a JSON object.
        `}] 
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.INTEGER, description: "Total score out of 100" },
          criteriaMet: { type: Type.ARRAY, items: { type: Type.STRING } },
          diagnosisScore: { type: Type.INTEGER },
          diagnosisFeedback: { type: Type.STRING, description: "Feedback specifically for the diagnosis part in Thai" },
          feedback: { type: Type.STRING, description: "General clinical feedback in Thai" }
        },
        required: ["score", "criteriaMet", "diagnosisScore", "diagnosisFeedback", "feedback"]
      },
    },
  });

  return JSON.parse(response.text?.trim() || "{}");
};
