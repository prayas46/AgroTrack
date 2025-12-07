
'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Pause, AlertTriangle } from "lucide-react";
import { ZoneCard, type Zone } from "./zone-card";
import { irrigationZones } from "./data";
import { useToast } from "@/hooks/use-toast";

export default function IrrigationPage() {
  const [zones, setZones] = useState<Zone[]>(irrigationZones);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const { toast } = useToast();

  const handleToggleSystem = () => {
    const newStatus = !isSystemRunning;
    setIsSystemRunning(newStatus);
    setZones(zones.map(zone => ({ ...zone, status: newStatus ? 'active' : 'idle' })));
    toast({
      title: `Irrigation System ${newStatus ? 'Started' : 'Stopped'}`,
      description: `All zones have been ${newStatus ? 'activated' : 'paused'}.`,
    });
  };

  const handleEmergencyStop = () => {
    setIsSystemRunning(false);
    setZones(zones.map(zone => ({ ...zone, status: 'critical' })));
     toast({
      variant: 'destructive',
      title: "Emergency Stop Activated",
      description: "All irrigation has been halted immediately.",
    });
  };

  const handleToggleZone = (zoneId: number) => {
    setZones(zones.map(zone => {
      if (zone.id === zoneId) {
        const newStatus = zone.status === 'active' ? 'idle' : 'active';
         toast({
            title: `Zone ${zone.name} ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        });
        return { ...zone, status: newStatus };
      }
      return zone;
    }));
  };


  return (
    <div className="space-y-8">
      <PageHeader
        title="Irrigation Management"
        description="Monitor and control your farm's irrigation zones with real-time data."
      />

      <Card>
        <CardHeader>
          <CardTitle>Master Controls</CardTitle>
          <CardDescription>
            Manage the entire irrigation system from one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button
            onClick={handleToggleSystem}
            className="w-full sm:w-auto"
          >
            {isSystemRunning ? (
              <>
                <Pause className="mr-2" /> Stop System
              </>
            ) : (
              <>
                <Play className="mr-2" /> Start System
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleEmergencyStop}
            className="w-full sm:w-auto"
          >
            <AlertTriangle className="mr-2" /> Emergency Stop
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
         <h2 className="text-2xl font-bold tracking-tight font-headline">Irrigation Zones</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} onToggle={handleToggleZone} />
          ))}
        </div>
      </div>
    </div>
  );
}
