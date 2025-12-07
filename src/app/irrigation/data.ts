
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
  day: string;
  readings: {
    [key: string]: number;
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

export const weeklyMoistureData: MoistureHistory[] = [
  { day: 'Sun', readings: { zone_1: 65, zone_2: 70, zone_3: 62, zone_4: 78, zone_5: 55, zone_6: 72 } },
  { day: 'Mon', readings: { zone_1: 68, zone_2: 75, zone_3: 64, zone_4: 80, zone_5: 58, zone_6: 76 } },
  { day: 'Tue', readings: { zone_1: 72, zone_2: 78, zone_3: 68, zone_4: 82, zone_5: 62, zone_6: 79 } },
  { day: 'Wed', readings: { zone_1: 70, zone_2: 76, zone_3: 66, zone_4: 81, zone_5: 60, zone_6: 77 } },
  { day: 'Thu', readings: { zone_1: 66, zone_2: 71, zone_3: 63, zone_4: 79, zone_5: 57, zone_6: 74 } },
  { day: 'Fri', readings: { zone_1: 69, zone_2: 74, zone_3: 67, zone_4: 83, zone_5: 61, zone_6: 78 } },
  { day: 'Sat', readings: { zone_1: 73, zone_2: 80, zone_3: 70, zone_4: 85, zone_5: 64, zone_6: 81 } },
];
