import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, GroundingSource, ProjectFile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRepository = async (url: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      You are a Senior Embedded Software Architect and MicroPython Expert.
      
      **Task:** Analyze the repository at ${url}.
      
      **Goal:** 
      1. Create a "Project Analysis & Upgrade Report" (Markdown) for the UI.
         - **Section 1: Current Project Overview**: Start by explicitly describing the CURRENT functionality of this repository. What is it? Who is it for? What are its current use cases?
         - **Section 2: The V2.0 Upgrade Strategy**: Explain the architectural shift (e.g., Super-loop -> AsyncIO), new features, and why these changes make it "Production-Grade".
         - **Section 3: Migration Strategy Summary**: A brief overview of the steps to switch.

      2. Generate a **MIGRATION_GUIDE.md** file. This is CRITICAL. It must contain:
         - "Original vs New Structure" comparison table.
         - "Step-by-Step Migration Guide" (e.g., 1. Wipe flash using esptool, 2. Upload /lib, 3. Upload config).
         - "Deep Changelog" of all improvements.
      
      3. Generate the ACTUAL 100% functional source code files for the V2 upgrade.

      **Requirements for the Generated Files:**
      - **MIGRATION_GUIDE.md**: The documentation file described above.
      - **boot.py**: Robust boot sequence with garbage collection, storage mounting, and optional debug mode.
      - **config.json**: JSON file for separating Wifi SSID/Pass and MQTT settings from code.
      - **main.py**: Use \`uasyncio\`. Create a robust main loop with error catching, watchdog feeding, and task scheduling.
      - **lib/network_manager.py**: A professional class to handle WiFi connection, auto-reconnect, and status LED blinking without blocking.

      **Output Format:**
      Return the response in a strict JSON format matching the provided schema.
      - \`improvementPlan\`: The Markdown string containing Section 1 (Current Overview), Section 2 (Upgrade), and Section 3 (Migration).
      - \`files\`: An array of file objects.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        improvementPlan: {
          type: Type.STRING,
          description: "A comprehensive markdown report. MUST start with 'Current Project Overview' describing what the repo does, followed by the 'Upgrade Plan'.",
        },
        files: {
          type: Type.ARRAY,
          description: "List of files to be generated, including MIGRATION_GUIDE.md.",
          items: {
            type: Type.OBJECT,
            properties: {
              filename: { type: Type.STRING, description: "The full path/name of the file (e.g., main.py, MIGRATION_GUIDE.md)" },
              content: { type: Type.STRING, description: "The complete, functional python, json, or markdown code." },
              description: { type: Type.STRING, description: "Short description of what this file does." }
            },
            required: ["filename", "content", "description"]
          }
        }
      },
      required: ["improvementPlan", "files"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text || "{}";
    let parsedData: { improvementPlan: string; files: ProjectFile[] };
    
    try {
      parsedData = JSON.parse(jsonText);
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      throw new Error("The AI generated an invalid response format. Please try again.");
    }

    // Extract grounding chunks
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = [];

    groundingChunks.forEach(chunk => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri || "#"
        });
      }
    });

    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      improvementPlan: parsedData.improvementPlan,
      files: parsedData.files,
      sources: uniqueSources
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to analyze repository.");
  }
};