"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Task } from "@/lib/types";

// Zod schema for task form validation
const taskFormSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  deadline: z.string().min(1, "Deadline is required").regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, "Invalid deadline format (YYYY-MM-DD HH:MM)"),
  importance: z.enum(["high", "medium", "low"], {
    required_error: "Importance level is required",
  }),
  estimatedDuration: z.coerce.number().min(0.1, "Duration must be at least 0.1 hours"),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      deadline: "",
      importance: "medium",
      estimatedDuration: 1,
    },
  });

  function onSubmit(data: TaskFormValues) {
    const newTask: Task = {
      id: crypto.randomUUID(), // Generate unique ID
      ...data,
    };
    onAddTask(newTask);
    form.reset(); // Reset form after submission
    setIsOpen(false); // Close popover after submission
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Plus className="mr-2" /> Add Task
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finish report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    {/* Basic text input for deadline - could be enhanced with Calendar */}
                    <Input placeholder="YYYY-MM-DD HH:MM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select importance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Est. Duration (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min="0.1" placeholder="e.g., 1.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Task</Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
