"use client";

import * as React from "react";
import { BrainCircuit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TaskForm } from "@/components/daywise/TaskForm";
import { TaskList } from "@/components/daywise/TaskList";
import { ScheduleDisplay } from "@/components/daywise/ScheduleDisplay";
import { handleSuggestSchedule } from "@/app/actions";
import type { Task, ScheduleItem } from "@/lib/types";

export default function Home() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [schedule, setSchedule] = React.useState<ScheduleItem[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = React.useState(false);
  const [scheduleError, setScheduleError] = React.useState<string | null>(null);

  // Load tasks from local storage on initial mount
  React.useEffect(() => {
    const storedTasks = localStorage.getItem("daywiseTasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
        localStorage.removeItem("daywiseTasks"); // Clear invalid data
      }
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  React.useEffect(() => {
    localStorage.setItem("daywiseTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
     // Clear schedule if a task affecting it is deleted
    setSchedule([]);
    setScheduleError(null);
  };

  const fetchSchedule = async () => {
    if (tasks.length === 0) {
      setScheduleError("Please add at least one task to generate a schedule.");
      setSchedule([]);
      return;
    }
    setIsLoadingSchedule(true);
    setScheduleError(null);
    setSchedule([]); // Clear previous schedule

    const result = await handleSuggestSchedule(tasks);

    if (result.error) {
      setScheduleError(result.error);
      setSchedule([]);
    } else if (result.schedule) {
      setSchedule(result.schedule);
    } else {
       setScheduleError("Received an unexpected response from the schedule generator.");
       setSchedule([]);
    }

    setIsLoadingSchedule(false);
  };

  return (
    <main className="container mx-auto max-w-4xl p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">DayWise</h1>
        <p className="text-muted-foreground">Plan your day with AI-powered suggestions.</p>
      </header>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            <span>Your Tasks</span>
            <TaskForm onAddTask={handleAddTask} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="text-center mb-6">
        <Button
          onClick={fetchSchedule}
          disabled={isLoadingSchedule || tasks.length === 0}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all duration-200 hover:scale-105"
        >
          <BrainCircuit className="mr-2" />
          {isLoadingSchedule ? "Generating..." : "Suggest Schedule"}
        </Button>
      </div>

      <ScheduleDisplay schedule={schedule} isLoading={isLoadingSchedule} error={scheduleError} />

       <footer className="text-center mt-12 text-sm text-muted-foreground">
           Built with Firebase Studio & Genkit
       </footer>
    </main>
  );
}
