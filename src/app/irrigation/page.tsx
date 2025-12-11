
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Pause, AlertTriangle, Droplets } from "lucide-react";
import { ZoneCard } from "./zone-card";
import type { Zone } from "./data";
import { irrigationZones, weeklyMoistureData } from "./data";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { MoistureChart } from "./moisture-chart";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TOTAL_WATER_VOLUME = 5000; // Liters
type ScheduleMode = 'auto' | 'daily' | 'every-other-day' | 'weekly' | 'manual';


export default function IrrigationPage() {
  const [zones, setZones] = useState<Zone[]>(irrigationZones);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [waterUsed, setWaterUsed] = useState(TOTAL_WATER_VOLUME * 0.45); // Start at 45% used
  const { toast } = useToast();

  const [moistureThreshold, setMoistureThreshold] = useState(65);
  const [irrigationDuration, setIrrigationDuration] = useState(30);
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('auto');

  // The simulation effect is kept to make the zone cards feel interactive.
  useEffect(() => {
    const zoneInterval = setInterval(() => {
      setZones(prevZones => 
        prevZones.map(zone => {
          let newMoisture;
          if (zone.status === 'active') {
            newMoisture = Math.min(95, zone.moisture + Math.random() * 2);
          } else if (zone.status === 'critical') {
            newMoisture = zone.moisture;
          } else {
            newMoisture = Math.max(40, zone.moisture - Math.random() * 0.5);
          }
          
          let newStatus: Zone['status'] = zone.status;
           if (zone.status !== 'active' && zone.status !== 'critical') {
             if (newMoisture > 75) newStatus = 'good';
             else if (newMoisture < 60) newStatus = 'warning';
             else newStatus = 'idle';
           }
          
          return { ...zone, moisture: parseFloat(newMoisture.toFixed(1)), status: newStatus };
        })
      );
    }, 3000);

    return () => clearInterval(zoneInterval);
  }, []);

  useEffect(() => {
    let usageInterval: NodeJS.Timeout;
    if (isSystemRunning) {
      usageInterval = setInterval(() => {
        setWaterUsed(prevUsed => {
            const activeZones = zones.filter(z => z.status === 'active').length;
            const newUsed = prevUsed + (5 * activeZones); // Use 5 liters per active zone
            if (newUsed >= TOTAL_WATER_VOLUME) {
                setIsSystemRunning(false);
                toast({
                    variant: 'destructive',
                    title: 'Water Tank Empty',
                    description: 'The irrigation system has stopped.',
                });
                return TOTAL_WATER_VOLUME;
            }
            return newUsed;
        });
      }, 1000);
    }

    return () => clearInterval(usageInterval);
  }, [isSystemRunning, zones, toast]);


  const handleToggleSystem = () => {
    if (waterUsed >= TOTAL_WATER_VOLUME) {
         toast({
            variant: 'destructive',
            title: 'Cannot Start',
            description: 'The water tank is empty.',
         });
        return;
    }
    const newStatus = !isSystemRunning;
    setIsSystemRunning(newStatus);
    setZones(zones.map(zone => ({ ...zone, status: newStatus && zone.status !== 'critical' ? 'active' : 'idle' })));
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
        if (zone.status === 'critical') {
            toast({
                variant: 'destructive',
                title: 'Zone is in Critical State',
                description: 'Cannot activate a zone under emergency stop.'
            });
            return zone;
        }
        const newStatus = zone.status === 'active' ? 'idle' : 'active';
         toast({
            title: `Zone ${zone.name} ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
        });
        return { ...zone, status: newStatus };
      }
      return zone;
    }));
  };

  const waterUsagePercent = (waterUsed / TOTAL_WATER_VOLUME) * 100;
  const waterRemaining = TOTAL_WATER_VOLUME - waterUsed;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Irrigation Management"
        description="Real-time soil moisture monitoring and automated irrigation control"
      />

      <Card>
        <CardHeader>
          <CardTitle>Irrigation Control Panel</CardTitle>
          <CardDescription>
            Manage the entire irrigation system from one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="moisture-threshold">Moisture Threshold</Label>
                  <span className="font-semibold text-primary">{moistureThreshold}%</span>
                </div>
                <Slider
                  id="moisture-threshold"
                  value={[moistureThreshold]}
                  onValueChange={(value) => setMoistureThreshold(value[0])}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                  <Label htmlFor="irrigation-duration">Irrigation Duration</Label>
                  <span className="font-semibold text-primary">{irrigationDuration} min</span>
                </div>
                <Slider
                  id="irrigation-duration"
                  value={[irrigationDuration]}
                  onValueChange={(value) => setIrrigationDuration(value[0])}
                  max={120}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-mode">Schedule Mode</Label>
                <Select value={scheduleMode} onValueChange={(value: ScheduleMode) => setScheduleMode(value)}>
                  <SelectTrigger id="schedule-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Sensor-based)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="every-other-day">Every Other Day</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
           </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              onClick={handleToggleSystem}
              className="w-full sm:w-auto"
              disabled={waterUsed >= TOTAL_WATER_VOLUME && !isSystemRunning}
            >
              {isSystemRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Stop System
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start System
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmergencyStop}
              className="w-full sm:w-auto"
            >
              <AlertTriangle className="mr-2 h-4 w-4" /> Emergency Stop
            </Button>
          </div>
          <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500"/>
                    <span className='font-semibold'>Water Tank Level</span>
                  </div>
                  <span>{waterRemaining.toFixed(0)}L / {TOTAL_WATER_VOLUME}L Remaining</span>
              </div>
              <Progress value={100 - waterUsagePercent} className='h-4 [&>div]:bg-blue-500' />
              <div className="text-xs text-muted-foreground text-right">{ (100 - waterUsagePercent).toFixed(1) }% Full</div>
          </div>
        </CardContent>
      </Card>

      <MoistureChart moistureHistory={weeklyMoistureData} zones={zones} />

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
