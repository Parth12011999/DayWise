/**
 * @fileOverview This file initializes and configures the AI plugin for the application.
 * It currently uses the Google AI plugin (Gemini).
 */
'use server'; // Ensure this runs server-side for configuration

import {googleAI} from '@genkit-ai/googleai';
import {configureGenkit} from 'genkit';
import { definePlugin } from 'genkit';

// Define a plugin that just imports the ai object so it can be used elsewhere.
// This avoids the Next.js build error about exporting non-async objects from 'use server' files.
// NOTE: This plugin might not be strictly necessary anymore if 'ai' isn't exported,
// but keeping it doesn't hurt and might be useful if other configurations need it.
const aiPlugin = definePlugin({
    name: 'aiInstancePlugin',
    async onInit() {}, // No initialization needed here
});


// Configure Genkit with the Google AI plugin
configureGenkit({
  plugins: [
    googleAI({
      // Optional: Specify API key, otherwise checks GOOGLE_GENAI_API_KEY environment variable.
      // apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
    aiPlugin, // Include the dummy plugin
  ],
  logLevel: 'debug', // Set log level for development (optional)
  enableTracingAndMetrics: true, // Enable telemetry (optional)
});

// Do not export 'ai' directly from here.
// Flows will import 'ai' from 'genkit' after this configuration runs.
