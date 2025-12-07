
'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CropCard } from "./crop-card";
import { cropData, type Crop } from "./data";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CropManagementPage() {
  const [crops, setCrops] = useState<Crop[]>(cropData);
  const { toast } = useToast();

  const handleAddCrop = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to add new crops is not yet implemented.",
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
          <Button onClick={handleAddCrop}>
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
    </div>
  );
}
