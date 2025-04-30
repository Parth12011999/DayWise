"use client";

import * as React from "react";
import { Briefcase, Home, ShoppingCart, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
}

// Simple function to guess task category based on name - could be improved
const getCategoryIcon = (taskName: string) => {
  const lowerCaseName = taskName.toLowerCase();
  if (lowerCaseName.includes("work") || lowerCaseName.includes("report") || lowerCaseName.includes("meeting")) {
    return <Briefcase className="w-4 h-4 mr-1 text-muted-foreground" />;
  }
  if (lowerCaseName.includes("home") || lowerCaseName.includes("clean") || lowerCaseName.includes("cook")) {
    return <Home className="w-4 h-4 mr-1 text-muted-foreground" />;
  }
  if (lowerCaseName.includes("buy") || lowerCaseName.includes("shop") || lowerCaseName.includes("grocery")) {
    return <ShoppingCart className="w-4 h-4 mr-1 text-muted-foreground" />;
  }
  // Default icon or null if no category matches
  return null;
};

const getImportanceColor = (importance: 'high' | 'medium' | 'low') => {
  switch (importance) {
    case 'high':
      return 'bg-red-500/20 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-500/30';
    case 'low':
      return 'bg-green-500/20 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-500/30';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
}

export function TaskList({ tasks, onDeleteTask }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No tasks added yet. Add some tasks to get started!</p>;
  }

  // Sort tasks: High -> Medium -> Low importance, then by deadline ascending
  const sortedTasks = [...tasks].sort((a, b) => {
    const importanceOrder = { high: 3, medium: 2, low: 1 };
    if (importanceOrder[a.importance] !== importanceOrder[b.importance]) {
      return importanceOrder[b.importance] - importanceOrder[a.importance];
    }
    // If importance is the same, sort by deadline (earlier first)
    try {
        const dateA = new Date(a.deadline.replace(' ', 'T') + 'Z'); // Assume UTC for comparison
        const dateB = new Date(b.deadline.replace(' ', 'T') + 'Z');
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
             return dateA.getTime() - dateB.getTime();
        }
    } catch (e) {
        console.warn("Could not parse dates for sorting:", a.deadline, b.deadline);
    }
    // Fallback if dates are invalid or equal
    return 0;
  });

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <Card key={task.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
               {getCategoryIcon(task.name)}
               <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
            </div>
            <Badge variant="outline" className={cn("capitalize", getImportanceColor(task.importance))}>
              {task.importance}
            </Badge>
          </CardHeader>
          <CardContent className="flex items-center justify-between pt-0">
             <CardDescription className="text-sm">
                Deadline: {task.deadline} | Est: {task.estimatedDuration} hr(s)
             </CardDescription>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onDeleteTask(task.id)}
              aria-label={`Delete task ${task.name}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
