
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Edit, Eye, MapPin, Wheat } from "lucide-react";
import { type Crop, getDaysToHarvest } from "./data";
import { format } from "date-fns";

type CropCardProps = {
  crop: Crop;
  onViewDetails: (id: number) => void;
  onUpdate: (id: number) => void;
};

type HealthConfig = {
  variant: "secondary" | "outline" | "destructive";
  label: string;
  color: string;
  textColor: string;
};

const getHealthConfig = (health: number): HealthConfig => {
  if (health > 85) return { variant: "secondary", label: "Good", color: "bg-green-500", textColor: "text-green-800" };
  if (health > 70) return { variant: "outline", label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-800" };
  return { variant: "destructive", label: "Poor", color: "bg-red-500", textColor: "text-red-800" };
}

export function CropCard({ crop, onViewDetails, onUpdate }: CropCardProps) {
  const healthConfig = getHealthConfig(crop.health);
  const daysToHarvest = getDaysToHarvest(crop.harvestDate);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                 <CardTitle className="flex items-center gap-2">
                    <Wheat className="w-5 h-5 text-primary"/>
                    {crop.name}
                </CardTitle>
                <CardDescription>{crop.stage}</CardDescription>
            </div>
            <Badge variant={healthConfig.variant} className={`${healthConfig.textColor} dark:text-foreground`}>
                {healthConfig.label}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
            <div className="mb-1 flex justify-between items-center text-xs text-muted-foreground">
                <span >Crop Health</span>
                <span className="font-semibold">{crop.health}%</span>
            </div>
            <Progress value={crop.health} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{crop.area}</span>
            </div>
             <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Planted: {format(new Date(crop.plantedDate), "MMM d, yyyy")}</span>
            </div>
        </div>
        <div className="text-center p-3 rounded-md bg-secondary">
            <p className="text-sm text-secondary-foreground">Days until harvest</p>
            <p className="text-3xl font-bold text-primary">{daysToHarvest}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={() => onViewDetails(crop.id)} variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4"/> View
        </Button>
         <Button onClick={() => onUpdate(crop.id)} variant="secondary" className="w-full">
            <Edit className="mr-2 h-4 w-4"/> Update
        </Button>
      </CardFooter>
    </Card>
  );
}
