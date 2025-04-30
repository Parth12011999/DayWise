export interface Task {
  id: string;
  name: string;
  deadline: string; // Consider using Date type if more complex date logic is needed
  importance: 'high' | 'medium' | 'low';
  estimatedDuration: number; // Duration in hours
}

export interface ScheduleItem {
  taskName: string;
  startTime: string;
  endTime: string;
}
