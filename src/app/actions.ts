// Use server directive is required for server actions.
'use server';

import { suggestSchedule, type SuggestScheduleInput } from "@/ai/flows/suggest-schedule";
import type { Task, ScheduleItem } from "@/lib/types";

interface SuggestScheduleResult {
  schedule?: ScheduleItem[];
  error?: string;
}

/**
 * Server action to get schedule suggestions based on tasks.
 * @param tasks - Array of tasks.
 * @returns An object containing the suggested schedule or an error message.
 */
export async function handleSuggestSchedule(tasks: Task[]): Promise<SuggestScheduleResult> {
  if (!tasks || tasks.length === 0) {
    return { error: "No tasks provided to generate a schedule." };
  }

  // Format tasks for the Genkit flow input
  const flowInput: SuggestScheduleInput = {
    tasks: tasks.map(task => ({
      name: task.name,
      deadline: task.deadline, // Assuming deadline is already in 'YYYY-MM-DD HH:MM' format
      importance: task.importance,
      estimatedDuration: `${task.estimatedDuration} hours`, // Convert number to string format expected by the flow
    })),
  };

  try {
    console.log("Calling suggestSchedule flow with input:", JSON.stringify(flowInput, null, 2));
    const result = await suggestSchedule(flowInput);
    console.log("Received schedule suggestion:", JSON.stringify(result, null, 2));
    return { schedule: result.schedule };
  } catch (error) {
    console.error("Error calling suggestSchedule flow:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while suggesting the schedule.";
    return { error: `Failed to generate schedule: ${errorMessage}` };
  }
}
