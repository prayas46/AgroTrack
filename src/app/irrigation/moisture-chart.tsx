'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { MoistureHistory, Zone } from './data';
import { useMemo } from 'react';

type MoistureChartProps = {
  moistureHistory: MoistureHistory[];
  zones: Zone[];
};

// Define a fallback color palette for zones
const FALLBACK_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function MoistureChart({ moistureHistory, zones }: MoistureChartProps) {
  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    zones.forEach((zone, index) => {
      // Use zone-specific color or fallback
      const color = `hsl(var(--chart-${zone.id}))` || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
      config[`zone_${zone.id}`] = {
        label: zone.name,
        color,
      };
    });
    return config;
  }, [zones]);

  const chartData = useMemo(() => {
    return moistureHistory.map((historyPoint) => {
      const dataPoint: Record<string, any> = { day: historyPoint.day };
      zones.forEach((zone) => {
        const zoneKey = `zone_${zone.id}`;
        // Ensure we have a number value, default to 0 if undefined
        dataPoint[zoneKey] = historyPoint.readings[zoneKey] ?? 0;
      });
      return dataPoint;
    });
  }, [moistureHistory, zones]);

  if (!moistureHistory.length || !zones.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Moisture Trend</CardTitle>
          <CardDescription>Average moisture levels for the past week.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>
              {!zones.length 
                ? "No zones configured. Please add zones to see moisture data."
                : "Waiting for moisture data..."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Moisture Trend</CardTitle>
        <CardDescription>Average moisture levels for the past week.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
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
                {zones.map((zone) => {
                  const color = chartConfig[`zone_${zone.id}`]?.color || FALLBACK_COLORS[0];
                  return (
                    <linearGradient 
                      key={`gradient_${zone.id}`} 
                      id={`gradient_${zone.id}`} 
                      x1="0" 
                      y1="0" 
                      x2="0" 
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[40, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }} 
                content={<ChartTooltipContent indicator="dot" />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {zones.map((zone) => {
                const zoneKey = `zone_${zone.id}`;
                const color = chartConfig[zoneKey]?.color || FALLBACK_COLORS[0];
                
                return (
                  <Area
                    key={zone.id}
                    dataKey={zoneKey}
                    type="monotone"
                    fill={`url(#gradient_${zone.id})`}
                    stroke={color}
                    strokeWidth={2}
                    dot={{
                      fill: color,
                      strokeWidth: 2,
                      r: 3,
                    }}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      fill: color,
                      stroke: 'hsl(var(--background))',
                    }}
                    connectNulls={true}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
