
export type EquipmentStatus = "active" | "idle" | "maintenance";
export type EquipmentType = "Tractor" | "Harvester" | "Pump" | "Sprayer" | "Drone" | "Sensor";

export type Equipment = {
  id: number;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  metric: {
    type: "fuel" | "battery";
    value: number;
  };
  efficiency: number;
};

export const equipmentData: Equipment[] = [
  { id: 1, name: 'Tractor A', type: 'Tractor', status: 'active', metric: { type: 'fuel', value: 85 }, efficiency: 92 },
  { id: 2, name: 'Harvester B', type: 'Harvester', status: 'maintenance', metric: { type: 'fuel', value: 45 }, efficiency: 78 },
  { id: 3, name: 'Irrigation Pump', type: 'Pump', status: 'idle', metric: { type: 'battery', value: 100 }, efficiency: 95 },
  { id: 4, name: 'Sprayer C', type: 'Sprayer', status: 'idle', metric: { type: 'fuel', value: 30 }, efficiency: 85 },
  { id: 5, name: 'Drone Scanner', type: 'Drone', status: 'active', metric: { type: 'battery', value: 75 }, efficiency: 88 },
  { id: 6, name: 'Soil Sensor Array', type: 'Sensor', status: 'idle', metric: { type: 'battery', value: 90 }, efficiency: 96 }
];
