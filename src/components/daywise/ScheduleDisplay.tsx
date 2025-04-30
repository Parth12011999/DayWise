"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ScheduleItem } from "@/lib/types";

interface ScheduleDisplayProps {
  schedule: ScheduleItem[];
  isLoading: boolean;
  error?: string | null;
}

export function ScheduleDisplay({ schedule, isLoading, error }: ScheduleDisplayProps) {

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-muted-foreground text-center py-8">Generating schedule...</p>;
    }

    if (error) {
      return <p className="text-destructive text-center py-8">Error: {error}</p>;
    }

    if (!schedule || schedule.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No schedule generated yet. Add tasks and click "Suggest Schedule".</p>;
    }

    // Sort schedule by start time
    const sortedSchedule = [...schedule].sort((a, b) => {
       const timeA = a.startTime.split(':').map(Number);
       const timeB = b.startTime.split(':').map(Number);
       return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });

    return (
      <ul className="space-y-4">
        {sortedSchedule.map((item, index) => (
          <li key={index} className="flex items-center space-x-4">
            <div className="flex flex-col items-center w-16">
              <span className="font-mono text-sm text-primary">{item.startTime}</span>
              <Separator orientation="vertical" className="h-6 my-1 bg-primary/50" />
              <span className="font-mono text-xs text-muted-foreground">{item.endTime}</span>
            </div>
            <Card className="flex-1 shadow-sm bg-card/80 backdrop-blur-sm">
               <CardContent className="p-3">
                 <p className="font-medium text-card-foreground">{item.taskName}</p>
               </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    );
  }


  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-2 pb-4">
         <Clock className="w-5 h-5 text-primary" />
         <CardTitle>Suggested Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
