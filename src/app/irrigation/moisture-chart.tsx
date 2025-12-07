
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

export function MoistureChart({ moistureHistory, zones }: MoistureChartProps) {
    const chartConfig = useMemo(() => {
        const config: any = {};
        zones.forEach((zone) => {
            config[`zone_${zone.id}`] = {
                label: zone.name,
                color: `hsl(var(--chart-${zone.id}))`,
            };
        });
        return config;
    }, [zones]);

    const chartData = useMemo(() => {
        return moistureHistory.map((historyPoint) => {
        const dataPoint: { day: string; [key: string]: any } = { day: historyPoint.day };
        zones.forEach((zone) => {
            const zoneKey = `zone_${zone.id}`;
            dataPoint[zoneKey] = historyPoint.readings[zoneKey];
        });
        return dataPoint;
        });
    }, [moistureHistory, zones]);


  if (!moistureHistory.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Moisture Trend</CardTitle>
          <CardDescription>Average moisture levels for the past week.</CardDescription>
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
        <CardTitle>Weekly Moisture Trend</CardTitle>
        <CardDescription>Average moisture levels for the past week.</CardDescription>
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
                    <stop offset="5%" stopColor={chartConfig[`zone_${zone.id}`]?.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={chartConfig[`zone_${zone.id}`]?.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[40, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              {zones.map((zone) => (
                <Area
                  key={zone.id}
                  dataKey={`zone_${zone.id}`}
                  type="monotone"
                  fill={`url(#gradient_${zone.id})`}
                  stroke={chartConfig[`zone_${zone.id}`]?.color}
                  strokeWidth={2}
                  dot={{
                    fill: chartConfig[`zone_${zone.id}`]?.color,
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
