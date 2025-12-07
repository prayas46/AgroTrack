
import { differenceInDays, parseISO } from "date-fns";

export type CropStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Pod Formation' | 'Tuber Initiation';

export const cropStages: CropStage[] = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Pod Formation', 'Tuber Initiation'];

export type Crop = {
  id: number;
  name: string;
  stage: CropStage;
  plantedDate: string;
  harvestDate: string;
  health: number; // Percentage
  area: string;
};

export const cropData: Crop[] = [
  { id: 1, name: 'Wheat', stage: 'Vegetative', plantedDate: '2024-01-15', harvestDate: '2024-05-20', health: 85, area: '5 ha' },
  { id: 2, name: 'Corn', stage: 'Flowering', plantedDate: '2024-02-10', harvestDate: '2024-07-15', health: 92, area: '8 ha' },
  { id: 3, name: 'Rice', stage: 'Seedling', plantedDate: '2024-03-01', harvestDate: '2024-08-30', health: 78, area: '6 ha' },
  { id: 4, name: 'Soybean', stage: 'Pod Formation', plantedDate: '2024-02-28', harvestDate: '2024-06-25', health: 88, area: '4 ha' },
  { id: 5, name: 'Tomatoes', stage: 'Fruiting', plantedDate: '2024-01-30', harvestDate: '2024-04-20', health: 95, area: '2 ha' },
  { id: 6, name: 'Potatoes', stage: 'Tuber Initiation', plantedDate: '2024-02-15', harvestDate: '2024-06-10', health: 82, area: '3 ha' },
];

export function getDaysToHarvest(harvestDate: string): number {
  const today = new Date();
  const harvest = parseISO(harvestDate);
  const days = differenceInDays(harvest, today);
  return Math.max(0, days);
}
