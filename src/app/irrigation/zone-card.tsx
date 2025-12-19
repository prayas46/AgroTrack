
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet, Thermometer, Wind } from "lucide-react";
import type { Zone } from "./data";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const statusConfig: Record<Zone["status"], { variant: BadgeVariant; label: string; className: string }> = {
  active: {
    variant: "default",
    label: "Active",
    className: "border-blue-500 bg-blue-500/10",
  },
  idle: {
    variant: "secondary",
    label: "Idle",
    className: "border-gray-300 dark:border-gray-700",
  },
  warning: {
    variant: "outline",
    label: "Warning",
    className: "border-yellow-500 bg-yellow-500/10",
  },
  critical: {
    variant: "destructive",
    label: "Critical",
    className: "border-red-600 bg-red-500/10",
  },
  good: {
      variant: "secondary",
      label: "Good",
      className: "border-green-500 bg-green-500/10"
  }
};

type ZoneCardProps = {
  zone: Zone;
  onToggle: (id: number) => void;
};

export function ZoneCard({ zone, onToggle }: ZoneCardProps) {
  const config = statusConfig[zone.status] || statusConfig.idle;

  return (
    <Card className={`flex flex-col transition-all duration-300 ${config.className} border-2`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{zone.name}</CardTitle>
          <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
        </div>
        <CardDescription>{zone.area}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 text-primary">
                <Droplet className="h-6 w-6"/>
                <span className="text-3xl font-bold">{zone.moisture}%</span>
            </div>
            <span className="text-sm text-muted-foreground">Soil Moisture</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground"/>
                <span>{zone.temp}°C</span>
            </div>
            <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground"/>
                <span>{zone.wind} km/h</span>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onToggle(zone.id)} variant="outline" className="w-full" disabled={zone.status === 'critical'}>
          {zone.status === "active" ? "Pause Zone" : "Activate Zone"}
        </Button>
      </CardFooter>
    </Card>
  );
}
