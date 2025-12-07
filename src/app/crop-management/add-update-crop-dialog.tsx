
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Crop } from "./data";
import { cropStages } from "./data";

type AddOrUpdateCropDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Crop, 'id'>, id?: number) => void;
  crop: Crop | null;
};

const initialFormState: Omit<Crop, 'id'> = {
    name: "",
    stage: "" as Crop['stage'],
    plantedDate: new Date().toISOString().split('T')[0],
    harvestDate: "",
    health: 80,
    area: "",
};

export function AddOrUpdateCropDialog({ isOpen, onClose, onSave, crop }: AddOrUpdateCropDialogProps) {
  const [formState, setFormState] = useState(initialFormState);
  const isEditMode = !!crop;

  useEffect(() => {
    if (isOpen && crop) {
      setFormState({
        name: crop.name,
        stage: crop.stage,
        plantedDate: crop.plantedDate,
        harvestDate: crop.harvestDate,
        health: crop.health,
        area: crop.area,
      });
    } else if (isOpen && !crop) {
      setFormState(initialFormState);
    }
  }, [isOpen, crop]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: Crop['stage']) => {
    setFormState(prev => ({ ...prev, stage: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCropData = {
        ...formState,
        health: Number(formState.health),
    };
    onSave(newCropData, crop?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>{isEditMode ? 'Update Crop' : 'Add New Crop'}</DialogTitle>
            <DialogDescription>
                {isEditMode ? 'Edit the details of your crop.' : 'Fill in the details for the new crop you want to track.'}
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" value={formState.name} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="stage" className="text-right">Stage</Label>
                     <Select name="stage" value={formState.stage} onValueChange={handleSelectChange} required>
                        <SelectTrigger id="stage" className="col-span-3">
                            <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                            {cropStages.map(stage => (
                                <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plantedDate" className="text-right">Planted</Label>
                    <Input id="plantedDate" name="plantedDate" type="date" value={formState.plantedDate} onChange={handleChange} className="col-span-3" required/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="harvestDate" className="text-right">Harvest</Label>
                    <Input id="harvestDate" name="harvestDate" type="date" value={formState.harvestDate} onChange={handleChange} className="col-span-3" required/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="health" className="text-right">Health (%)</Label>
                    <Input id="health" name="health" type="number" min="0" max="100" value={formState.health} onChange={handleChange} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="area" className="text-right">Area</Label>
                    <Input id="area" name="area" placeholder="e.g., 5 ha" value={formState.area} onChange={handleChange} className="col-span-3" required/>
                </div>
            </div>
            <DialogFooter>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Crop'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
