import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    console.log("Listing available models...");
    // Direct listModels endpoint is not available in the simple SDK directly like this,
    // but we can try to find what works.
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
        console.log("Available models:");
        data.models.forEach((m: any) => {
            console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } else {
        console.log("No models found in response:", JSON.stringify(data, null, 2));
    }

  } catch (error: any) {
    console.error("Error listing models:", error.message);
  }
}

listModels();
