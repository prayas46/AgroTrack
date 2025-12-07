
export type ZoneStatus = "active" | "idle" | "warning" | "critical" | "good";

export type Zone = {
  id: number;
  name: string;
  moisture: number;
  status: ZoneStatus;
  area: string;
  temp: number;
  wind: number;
};

export type MoistureHistory = {
  time: string;
  readings: {
    [key: number]: number;
  };
};

export const irrigationZones: Zone[] = [
  { id: 1, name: 'North Field', moisture: 68, status: 'idle', area: '2.5 ha', temp: 24, wind: 5 },
  { id: 2, name: 'South Field', moisture: 72, status: 'idle', area: '3.0 ha', temp: 25, wind: 7 },
  { id: 3, name: 'East Orchard', moisture: 65, status: 'idle', area: '1.5 ha', temp: 23, wind: 4 },
  { id: 4, name: 'West Garden', moisture: 80, status: 'idle', area: '0.8 ha', temp: 26, wind: 8 },
  { id: 5, name: 'Central Plot', moisture: 58, status: 'idle', area: '4.2 ha', temp: 24, wind: 6 },
  { id: 6, name: 'Greenhouse', moisture: 75, status: 'idle', area: '0.5 ha', temp: 28, wind: 2 },
];
