// Use server directive is required for all Genkit source files.
'use server';

/**
 * @fileOverview Development entry point for running Genkit flows locally.
 * This file imports and makes flows available to the Genkit development server.
 */

import '@/ai/ai-instance'; // Ensure configuration runs first
import './flows/suggest-schedule'; // Import the flow to register it
