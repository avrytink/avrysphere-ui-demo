import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Generates a streaming response for the chat
   */
  async *generateChatStream(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const model = 'gemini-3-flash-preview';
    
    // Ensure we are using the new instance each time to catch updated API keys if applicable
    const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const streamResponse = await client.models.generateContentStream({
      model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are Avry AI, the core intelligence of avryOS. You are an expert system assistant. Your design is high-performance, minimalist, and efficient. Use Markdown for formatting. Keep responses professional, technical, and concise. You reside in a sidebar panel or dedicated app, so optimize for high density.",
      }
    });

    for await (const chunk of streamResponse) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  }

  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const model = 'gemini-3-flash-preview';
    const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await client.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are Avry AI, the core intelligence of avryOS. You help users navigate their virtual desktop, write code, and answer questions. Be professional, concise, and helpful.",
      }
    });

    return response.text;
  }
}