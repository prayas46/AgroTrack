
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CropCard } from "./crop-card";
import { cropData, type Crop, cropStages } from "./data";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCropDialog } from "./add-crop-dialog";

export default function CropManagementPage() {
  const [crops, setCrops] = useState<Crop[]>(cropData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setCrops(prevCrops =>
        prevCrops.map(crop => {
          // Simulate health change
          const healthChange = (Math.random() - 0.5) * 2;
          const newHealth = Math.max(0, Math.min(100, crop.health + healthChange));

          // Simulate stage progression
          let newStage = crop.stage;
          if (Math.random() < 0.02) { // Low probability to advance stage
             const currentStageIndex = cropStages.indexOf(crop.stage);
             if(currentStageIndex < cropStages.length - 1) {
                newStage = cropStages[currentStageIndex + 1];
             }
          }

          return { ...crop, health: parseFloat(newHealth.toFixed(1)), stage: newStage };
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddCrop = (newCrop: Omit<Crop, 'id'>) => {
    setCrops(prev => [
      ...prev,
      { ...newCrop, id: prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1 },
    ]);
    toast({
      title: "Crop Added",
      description: `${newCrop.name} has been added to your tracked crops.`,
    });
  };

  const handleUpdate = (cropId: number) => {
    toast({
      title: "Feature Coming Soon",
      description: `Updating crop #${cropId} is not yet implemented.`,
    });
  }

  const handleView = (cropId: number) => {
     toast({
      title: "Feature Coming Soon",
      description: `A detailed view for crop #${cropId} is not yet implemented.`,
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Crop Management"
        description="Monitor the health and progress of your crops from planting to harvest."
      />

       <Card>
        <CardHeader>
          <CardTitle>Master Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Crop
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          Crop Overview
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {crops.map((crop) => (
            <CropCard 
              key={crop.id} 
              crop={crop} 
              onViewDetails={handleView}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
      <AddCropDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddCrop={handleAddCrop}
      />
    </div>
  );
}
