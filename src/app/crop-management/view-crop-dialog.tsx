
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, HeartPulse, GitCommitHorizontal, Wheat, Leaf } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Crop } from "./data";
import { getDaysToHarvest } from "./data";


type ViewCropDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop | null;
};

type HealthConfig = {
  variant: "secondary" | "outline" | "destructive";
  label: string;
  color: string;
};

const getHealthConfig = (health: number): HealthConfig => {
  if (health > 85) return { variant: "secondary", label: "Good", color: "text-green-600" };
  if (health > 70) return { variant: "outline", label: "Fair", color: "text-yellow-600" };
  return { variant: "destructive", label: "Poor", color: "text-red-600" };
}

export function ViewCropDialog({ isOpen, onClose, crop }: ViewCropDialogProps) {
  if (!crop) return null;

  const healthConfig = getHealthConfig(crop.health);
  const daysToHarvest = getDaysToHarvest(crop.harvestDate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Wheat className="w-6 h-6 text-primary" />
            {crop.name}
          </DialogTitle>
          <DialogDescription>
            Detailed overview of your crop's status.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className="space-y-4">
                 <div>
                    <div className="mb-1 flex justify-between items-center text-sm text-muted-foreground">
                        <span className="font-semibold flex items-center gap-2"><HeartPulse className="w-4 h-4" /> Crop Health</span>
                        <span className={`font-bold text-lg ${healthConfig.color}`}>{crop.health}%</span>
                    </div>
                    <Progress value={crop.health} className="h-2" />
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary">
                    <p className="text-sm text-secondary-foreground">Days until harvest</p>
                    <p className="text-4xl font-bold text-primary">{daysToHarvest}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                    <Leaf className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Stage</p>
                        <p className="text-muted-foreground">{crop.stage}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Area</p>
                        <p className="text-muted-foreground">{crop.area}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Planted Date</p>
                        <p className="text-muted-foreground">{format(parseISO(crop.plantedDate), "MMM d, yyyy")}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="font-semibold">Est. Harvest</p>
                        <p className="text-muted-foreground">{format(parseISO(crop.harvestDate), "MMM d, yyyy")}</p>
                    </div>
                </div>
            </div>

             <div className="flex justify-end">
                <Badge variant={healthConfig.variant} className="capitalize">{healthConfig.label} condition</Badge>
             </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
