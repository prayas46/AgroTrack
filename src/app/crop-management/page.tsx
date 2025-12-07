
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CropCard } from "./crop-card";
import { cropData, type Crop, cropStages } from "./data";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddOrUpdateCropDialog } from "./add-update-crop-dialog";
import { ViewCropDialog } from "./view-crop-dialog";

export default function CropManagementPage() {
  const [crops, setCrops] = useState<Crop[]>(cropData);
  const [dialogState, setDialogState] = useState<{
    mode: 'add' | 'edit' | 'view' | null;
    crop: Crop | null;
  }>({ mode: null, crop: null });

  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (dialogState.mode) return; // Pause simulation when a dialog is open
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
  }, [dialogState.mode]);

  const handleSaveCrop = (cropData: Omit<Crop, 'id'>, id?: number) => {
    if (id) {
        // Update existing crop
        setCrops(prev => prev.map(c => c.id === id ? { ...c, ...cropData } : c));
        toast({
            title: "Crop Updated",
            description: `${cropData.name} has been successfully updated.`,
        });
    } else {
        // Add new crop
        setCrops(prev => [
            ...prev,
            { ...cropData, id: prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1 },
        ]);
        toast({
            title: "Crop Added",
            description: `${cropData.name} has been added to your tracked crops.`,
        });
    }
    setDialogState({ mode: null, crop: null });
  };

  const handleUpdate = (cropId: number) => {
    const cropToEdit = crops.find(c => c.id === cropId);
    if (cropToEdit) {
        setDialogState({ mode: 'edit', crop: cropToEdit });
    }
  }

  const handleView = (cropId: number) => {
     const cropToView = crops.find(c => c.id === cropId);
    if (cropToView) {
        setDialogState({ mode: 'view', crop: cropToView });
    }
  }

  const closeDialog = () => {
    setDialogState({ mode: null, crop: null });
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
          <Button onClick={() => setDialogState({ mode: 'add', crop: null })}>
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
      
      <AddOrUpdateCropDialog
        isOpen={dialogState.mode === 'add' || dialogState.mode === 'edit'}
        onClose={closeDialog}
        onSave={handleSaveCrop}
        crop={dialogState.crop}
      />

      <ViewCropDialog 
        isOpen={dialogState.mode === 'view'}
        onClose={closeDialog}
        crop={dialogState.crop}
      />

    </div>
  );
}
