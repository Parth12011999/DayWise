// Use server directive is required for all Genkit flows.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting a daily schedule based on user tasks, deadlines, and importance.
 *
 * - suggestSchedule - A function that takes task details and suggests an optimal schedule.
 * - SuggestScheduleInput - The input type for the suggestSchedule function, defining the structure of task information.
 * - SuggestScheduleOutput - The output type for the suggestSchedule function, outlining the suggested schedule format.
 */

import {ai} from 'genkit'; // Import ai directly from genkit
import {z} from 'zod'; // Assuming zod is used directly based on package.json

// Define the input schema for the suggestSchedule function
const SuggestScheduleInputSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string().describe('The name of the task.'),
      deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD HH:MM).'),
      importance: z.enum(['high', 'medium', 'low']).describe('The importance of the task.'),
      estimatedDuration: z
        .string()
        .describe('Estimated duration of the task in hours (e.g., 1.5 hours)'),
    })
  ).describe('A list of tasks to schedule for the day.'),
});
export type SuggestScheduleInput = z.infer<typeof SuggestScheduleInputSchema>;

// Define the output schema for the suggestSchedule function
const SuggestScheduleOutputSchema = z.object({
  schedule: z.array(
    z.object({
      taskName: z.string().describe('The name of the scheduled task.'),
      startTime: z.string().describe('The suggested start time for the task (e.g., HH:MM).'),
      endTime: z.string().describe('The suggested end time for the task (e.g., HH:MM).'),
    })
  ).describe('A suggested schedule for the day.'),
});
export type SuggestScheduleOutput = z.infer<typeof SuggestScheduleOutputSchema>;

// Exported function to suggest a schedule
export async function suggestSchedule(input: SuggestScheduleInput): Promise<SuggestScheduleOutput> {
  return suggestScheduleFlow(input);
}

const assessTaskDurationAndImportance = ai.defineTool({
  name: 'assessTaskDurationAndImportance',
  description: 'Assess the duration and importance of a task to help schedule it effectively.',
  inputSchema: z.object({
    task: z.object({
      name: z.string().describe('The name of the task.'),
      deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD HH:MM).'),
      importance: z.enum(['high', 'medium', 'low']).describe('The importance of the task.'),
      estimatedDuration: z
        .string()
        .describe('Estimated duration of the task in hours (e.g., 1.5 hours)'),
    }),
  }),
  outputSchema: z.object({
    adjustedDuration: z
      .number()
      .describe('The adjusted duration of the task in hours, based on its importance and deadline.'),
    priorityScore: z.number().describe('A score indicating the task priority for scheduling.'),
  }),
},
async (input) => {
    // Placeholder implementation for assessing task duration and importance.
    // In a real application, this would involve more complex logic.
    const {
        task: {
            importance,
            estimatedDuration
        }
    } = input;

    let priorityScore = 0;
    switch (importance) {
      case 'high':
        priorityScore = 3;
        break;
      case 'medium':
        priorityScore = 2;
        break;
      case 'low':
        priorityScore = 1;
        break;
    }

    // Ensure estimatedDuration is parsed correctly, handle potential NaN
    const durationHours = parseFloat(estimatedDuration);
    const adjustedDuration = isNaN(durationHours) ? 1 : durationHours; // Default to 1 hour if parsing fails

    return {
      adjustedDuration: adjustedDuration,
      priorityScore: priorityScore,
    };
  }
);

// Define the prompt for suggesting a schedule
const suggestSchedulePrompt = ai.definePrompt({
  name: 'suggestSchedulePrompt',
  input: {
    schema: SuggestScheduleInputSchema,
  },
  output: {
    schema: SuggestScheduleOutputSchema,
  },
  tools: [assessTaskDurationAndImportance],
  prompt: `Given the following tasks, suggest an optimal schedule for the day (today), taking into account deadlines, importance, and estimated durations.

Tasks:
{{#each tasks}}
- Name: {{this.name}}, Deadline: {{this.deadline}}, Importance: {{this.importance}}, Estimated Duration: {{this.estimatedDuration}}
{{/each}}

Use the assessTaskDurationAndImportance tool if needed to evaluate task priorities and durations.

The schedule should prioritize high-importance tasks and those with nearer deadlines. Assume a standard working day (e.g., 9:00 to 17:00), but be flexible if tasks require time outside these hours or if total duration exceeds a standard day. Insert reasonable breaks between tasks (e.g., 15-30 minutes).

Output the schedule as a JSON array of task objects with taskName, startTime (HH:MM), and endTime (HH:MM). Ensure the times are logical and sequential.
`,
});

// Define the Genkit flow for suggesting a schedule
const suggestScheduleFlow = ai.defineFlow<
  typeof SuggestScheduleInputSchema,
  typeof SuggestScheduleOutputSchema
>(
  {
    name: 'suggestScheduleFlow',
    inputSchema: SuggestScheduleInputSchema,
    outputSchema: SuggestScheduleOutputSchema,
  },
  async (input) => {
    const { output } = await suggestSchedulePrompt(input);
    if (!output) {
      // Handle cases where the prompt might return no output, although unlikely with a defined output schema
      console.error("Suggest schedule prompt returned no output.");
      throw new Error("Failed to generate schedule suggestion.");
    }
    // Basic validation: ensure output structure matches schema expectations before returning
    if (!output.schedule || !Array.isArray(output.schedule)) {
        console.error("Suggest schedule prompt returned invalid output structure:", output);
        // Attempt to return an empty schedule or throw, depending on desired behavior
        return { schedule: [] };
        // OR: throw new Error("Received invalid schedule format.");
    }
    return output;
  }
);
