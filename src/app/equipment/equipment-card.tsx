
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Wrench, Battery, Fuel, Tractor, Bot, Cog, type LucideIcon } from "lucide-react";
import type { Equipment } from "./data";
import { useToast } from "@/hooks/use-toast";


const statusConfig: { [key in Equipment['status']]: { variant: "default" | "secondary" | "destructive" | "outline", label: string } } = {
  active: { variant: "default", label: "Active" },
  idle: { variant: "secondary", label: "Idle" },
  maintenance: { variant: "destructive", label: "Maintenance" },
};

const typeIcons: Record<Equipment["type"], LucideIcon> = {
    Tractor: Tractor,
    Harvester: Bot,
    Pump: Cog,
    Sprayer: Bot,
    Drone: Bot,
    Sensor: Bot,
}


type EquipmentCardProps = {
  equipment: Equipment;
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const { toast } = useToast();
  const config = statusConfig[equipment.status];
  const TypeIcon = typeIcons[equipment.type];
  const MetricIcon = equipment.metric.type === 'fuel' ? Fuel : Battery;

  const handleTrack = () => {
      toast({ title: "Tracking Started", description: `Now tracking ${equipment.name}.`});
  }

  const handleMaintain = () => {
      toast({ title: "Maintenance Scheduled", description: `Maintenance has been scheduled for ${equipment.name}.`});
  }


  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TypeIcon className="w-5 h-5 text-primary" />
              {equipment.name}
            </CardTitle>
            <CardDescription>{equipment.type}</CardDescription>
          </div>
          <Badge variant={config.variant} className="capitalize">{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <div className="mb-1 flex justify-between items-center text-xs text-muted-foreground">
            <span>Operational Efficiency</span>
            <span className="font-semibold">{equipment.efficiency}%</span>
          </div>
          <Progress value={equipment.efficiency} className="h-2" />
        </div>
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
            <MetricIcon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-grow">
                 <div className="mb-1 flex justify-between items-center text-xs text-muted-foreground">
                    <span className="capitalize">{equipment.metric.type} Level</span>
                    <span className="font-semibold">{equipment.metric.value}%</span>
                </div>
                <Progress value={equipment.metric.value} className="h-2" />
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleTrack} variant="outline" className="w-full">
          <MapPin className="mr-2 h-4 w-4" /> Track
        </Button>
        <Button onClick={handleMaintain} variant="secondary" className="w-full">
          <Wrench className="mr-2 h-4 w-4" /> Maintain
        </Button>
      </CardFooter>
    </Card>
  );
}
