'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { MoistureHistory, Zone } from './data';
import { useMemo } from 'react';

type MoistureChartProps = {
  moistureHistory: MoistureHistory[];
  zones: Zone[];
};

const zoneColors: { [key: number]: string } = {
  1: 'hsl(198, 93%, 60%)', // Blue
  2: 'hsl(142, 71%, 45%)', // Green
  3: 'hsl(34, 97%, 64%)', // Orange
  4: 'hsl(28, 95%, 53%)', // Darker Orange
  5: 'hsl(316, 73%, 58%)', // Pink
  6: 'hsl(var(--primary))', // Primary color
};

export function MoistureChart({ moistureHistory, zones }: MoistureChartProps) {
  const chartData = useMemo(() => {
    return moistureHistory.map((historyPoint) => {
      const dataPoint: { time: string; [key: string]: any } = { time: historyPoint.time };
      zones.forEach((zone) => {
        dataPoint[`zone_${zone.id}`] = historyPoint.readings[zone.id];
      });
      return dataPoint;
    });
  }, [moistureHistory, zones]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    zones.forEach((zone) => {
      config[`zone_${zone.id}`] = {
        label: zone.name,
        color: zoneColors[zone.id] || 'hsl(var(--foreground))',
      };
    });
    return config;
  }, [zones]);

  if (!moistureHistory.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Moisture Trend</CardTitle>
          <CardDescription>Real-time moisture levels across all zones.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Waiting for moisture data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moisture Trend</CardTitle>
        <CardDescription>Real-time moisture levels across all zones.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <defs>
                {zones.map((zone) => (
                  <linearGradient key={`gradient_${zone.id}`} id={`gradient_${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={zoneColors[zone.id] || 'hsl(var(--foreground))'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={zoneColors[zone.id] || 'hsl(var(--foreground))'} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(-5)} // Display only HH:MM
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[40, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
              <Legend content={<ChartLegendContent />} />
              {zones.map((zone) => (
                <Area
                  key={zone.id}
                  dataKey={`zone_${zone.id}`}
                  type="monotone"
                  fill={`url(#gradient_${zone.id})`}
                  stroke={zoneColors[zone.id] || 'hsl(var(--foreground))'}
                  strokeWidth={2}
                  dot={{
                    fill: zoneColors[zone.id] || 'hsl(var(--foreground))',
                    strokeWidth: 2,
                    r: 3,
                  }}
                  activeDot={{
                     r: 6,
                     strokeWidth: 2,
                  }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
