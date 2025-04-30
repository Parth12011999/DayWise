import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: gemini20Flash,
});